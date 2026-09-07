import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAuthAndRole, checkRateLimit, formatFriendlyError, getClientIp } from '@/lib/security';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Helper: Upload base64 image to Supabase 'tesca-assets' storage bucket
async function handleImageUpload(adminClient: any, imageUrlOrBase64: string): Promise<string> {
  if (!imageUrlOrBase64 || !imageUrlOrBase64.startsWith('data:image/')) {
    return imageUrlOrBase64;
  }
  try {
    const matches = imageUrlOrBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return imageUrlOrBase64;
    }
    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    let ext = mimeType.split('/')[1] || 'jpeg';
    if (ext === 'jpeg') ext = 'jpg';
    const key = `blog-covers/${crypto.randomUUID()}.${ext}`;

    const { error } = await adminClient.storage.from('tesca-assets').upload(key, buffer, {
      contentType: mimeType,
      cacheControl: '31536000',
      upsert: false,
    });

    if (error) {
      console.warn('[Blog API] Base64 image upload to storage failed, falling back:', error.message);
      return imageUrlOrBase64;
    }

    const { data: publicData } = adminClient.storage.from('tesca-assets').getPublicUrl(key);
    return publicData?.publicUrl || imageUrlOrBase64;
  } catch (err) {
    console.error('[Blog API] Error uploading image to tesca-assets:', err);
    return imageUrlOrBase64;
  }
}

// Helper: Generate a unique slug for blog posts
async function generateUniqueSlug(adminClient: any, baseSlug: string, currentPostId?: string): Promise<string> {
  let cleanSlug = baseSlug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (!cleanSlug) cleanSlug = `post-${Date.now()}`;

  let candidate = cleanSlug;
  let counter = 1;

  while (true) {
    let query = adminClient.from('blog_posts').select('id').eq('slug', candidate);
    if (currentPostId) {
      query = query.neq('id', currentPostId);
    }
    const { data } = await query.maybeSingle();
    if (!data) {
      return candidate;
    }
    candidate = `${cleanSlug}-${counter}`;
    counter++;
  }
}

// Helper: Resilient insert handling optional author_id column
async function resilientInsert(adminClient: any, payload: Record<string, any>) {
  let result = await adminClient.from('blog_posts').insert(payload).select().single();
  if (result.error && (result.error.code === 'PGRST204' || result.error.message?.includes('author_id'))) {
    console.warn('[Blog API] author_id column not found in blog_posts, retrying insert without author_id...');
    const { author_id, ...safePayload } = payload;
    result = await adminClient.from('blog_posts').insert(safePayload).select().single();
  }
  return result;
}

// Helper: Resilient update handling optional author_id column
async function resilientUpdate(adminClient: any, id: string, updates: Record<string, any>) {
  let result = await adminClient.from('blog_posts').update(updates).eq('id', id).select().single();
  if (result.error && (result.error.code === 'PGRST204' || result.error.message?.includes('author_id'))) {
    console.warn('[Blog API] author_id column not found in blog_posts, retrying update without author_id...');
    const { author_id, ...safeUpdates } = updates;
    result = await adminClient.from('blog_posts').update(safeUpdates).eq('id', id).select().single();
  }
  return result;
}

// 1. GET: Fetch blog posts
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, 60, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Server database configuration missing.' }, { status: 500 });
    }

    // Check if authenticated caller
    let callerUser: { id: string; email: string; role: 'student' | 'admin' | 'tutor'; name?: string } | undefined;
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const auth = await verifyAuthAndRole(request, ['admin', 'tutor', 'student']);
      if (auth.authorized && auth.user) {
        callerUser = auth.user;
      }
    }

    const { data: posts, error } = await adminClient
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!posts) {
      return NextResponse.json([]);
    }

    // Admins see all posts (published + drafts)
    if (callerUser?.role === 'admin') {
      return NextResponse.json(posts);
    }

    // Tutors see all published posts + their own drafts
    if (callerUser?.role === 'tutor') {
      const tutorPosts = posts.filter((post: any) => {
        if (post.published) return true;
        if (post.author_id && post.author_id === callerUser!.id) return true;
        const authorLower = (post.author || '').toLowerCase();
        if (callerUser!.name && authorLower === callerUser!.name.toLowerCase()) return true;
        if (authorLower === callerUser!.email.toLowerCase()) return true;
        return false;
      });
      return NextResponse.json(tutorPosts);
    }

    // Public / guest / student callers: only published posts
    const publicPosts = posts.filter((post: any) => post.published);
    return NextResponse.json(publicPosts);
  } catch (error: any) {
    console.error('[Blog GET] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}

// 2. POST: Create new blog post
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, 20, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
    }

    const auth = await verifyAuthAndRole(request, ['admin', 'tutor']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json(
        { error: auth.error || 'Access denied. Only admins and tutors can post blogs.' },
        { status: auth.status || 401 }
      );
    }

    const body = await request.json();
    const { title, slug, excerpt, content, author, category, image_url, published } = body;

    // Validation
    if (!title || title.trim().length < 5) {
      return NextResponse.json({ error: 'Blog title must be at least 5 characters long.' }, { status: 400 });
    }
    if (!category || !category.trim()) {
      return NextResponse.json({ error: 'Please select a category for this blog post.' }, { status: 400 });
    }
    if (!image_url || !image_url.trim()) {
      return NextResponse.json({ error: 'Featured image is mandatory for all blog posts.' }, { status: 400 });
    }
    if (!excerpt || excerpt.trim().length < 15) {
      return NextResponse.json({ error: 'Summary/excerpt must be at least 15 characters long.' }, { status: 400 });
    }
    const plainContent = (content || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (plainContent.length < 200) {
      return NextResponse.json(
        { error: `Article content must be at least 200 characters long including spaces (current length: ${plainContent.length}).` },
        { status: 400 }
      );
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Server database configuration missing.' }, { status: 500 });
    }

    // Upload image to CDN storage if base64 data URL
    const finalImageUrl = await handleImageUpload(adminClient, image_url.trim());

    // Generate unique slug
    const initialSlug = (slug || title).trim();
    const uniqueSlug = await generateUniqueSlug(adminClient, initialSlug);

    const authorName = (author || auth.user.name || (auth.user.role === 'admin' ? 'TESCA Team' : 'TESCA Tutor')).trim();

    const insertPayload: Record<string, any> = {
      title: title.trim(),
      slug: uniqueSlug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: authorName,
      category: category.trim(),
      image_url: finalImageUrl,
      published: !!published,
      created_at: new Date().toISOString(),
      author_id: auth.user.id,
    };

    const { data, error } = await resilientInsert(adminClient, insertPayload);

    if (error) {
      console.error('[Blog POST] Insert failed:', error);
      throw error;
    }

    return NextResponse.json({ success: true, post: data }, { status: 201 });
  } catch (error: any) {
    console.error('[Blog POST] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}

// 3. PATCH: Update blog post
export async function PATCH(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, 30, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const auth = await verifyAuthAndRole(request, ['admin', 'tutor']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Access denied.' }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { id, title, slug, excerpt, content, author, category, image_url, published } = body;

    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required.' }, { status: 400 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Server database configuration missing.' }, { status: 500 });
    }

    // Check existing post and verify ownership for tutors
    const { data: existingPost, error: fetchErr } = await adminClient
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !existingPost) {
      return NextResponse.json({ error: 'Blog post not found.' }, { status: 404 });
    }

    if (auth.user.role === 'tutor') {
      const isOwner =
        (existingPost.author_id && existingPost.author_id === auth.user.id) ||
        (existingPost.author && auth.user.name && existingPost.author.toLowerCase() === auth.user.name.toLowerCase()) ||
        (existingPost.author && existingPost.author.toLowerCase() === auth.user.email.toLowerCase());

      if (!isOwner) {
        return NextResponse.json({ error: 'Access denied. You can only edit your own posts.' }, { status: 403 });
      }
    }

    const updates: Record<string, any> = {};

    if (title !== undefined) {
      if (title.trim().length < 5) {
        return NextResponse.json({ error: 'Blog title must be at least 5 characters.' }, { status: 400 });
      }
      updates.title = title.trim();
    }

    if (slug !== undefined && slug.trim()) {
      const newSlug = await generateUniqueSlug(adminClient, slug.trim(), id);
      updates.slug = newSlug;
    }

    if (category !== undefined) {
      if (!category.trim()) {
        return NextResponse.json({ error: 'Category cannot be empty.' }, { status: 400 });
      }
      updates.category = category.trim();
    }

    if (excerpt !== undefined) {
      if (excerpt.trim().length < 15) {
        return NextResponse.json({ error: 'Excerpt must be at least 15 characters.' }, { status: 400 });
      }
      updates.excerpt = excerpt.trim();
    }

    if (content !== undefined) {
      const plainContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      if (plainContent.length < 200) {
        return NextResponse.json({ error: 'Article content must be at least 200 characters.' }, { status: 400 });
      }
      updates.content = content.trim();
    }

    if (author !== undefined) {
      updates.author = author.trim();
    }

    if (published !== undefined) {
      updates.published = !!published;
    }

    if (image_url !== undefined && image_url.trim()) {
      const finalImg = await handleImageUpload(adminClient, image_url.trim());
      updates.image_url = finalImg;
    }

    const { data: updated, error: updateErr } = await resilientUpdate(adminClient, id, updates);

    if (updateErr) {
      console.error('[Blog PATCH] Update failed:', updateErr);
      throw updateErr;
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error('[Blog PATCH] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}

// 4. DELETE: Delete blog post
export async function DELETE(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, 30, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const auth = await verifyAuthAndRole(request, ['admin', 'tutor']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Access denied.' }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required.' }, { status: 400 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Server database configuration missing.' }, { status: 500 });
    }

    // Check existing post and verify ownership for tutors
    const { data: existingPost, error: fetchErr } = await adminClient
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !existingPost) {
      return NextResponse.json({ error: 'Blog post not found.' }, { status: 404 });
    }

    if (auth.user.role === 'tutor') {
      const isOwner =
        (existingPost.author_id && existingPost.author_id === auth.user.id) ||
        (existingPost.author && auth.user.name && existingPost.author.toLowerCase() === auth.user.name.toLowerCase()) ||
        (existingPost.author && existingPost.author.toLowerCase() === auth.user.email.toLowerCase());

      if (!isOwner) {
        return NextResponse.json({ error: 'Access denied. You can only delete your own posts.' }, { status: 403 });
      }
    }

    const { error: deleteErr } = await adminClient
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (deleteErr) {
      console.error('[Blog DELETE] Delete failed:', deleteErr);
      throw deleteErr;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Blog DELETE] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}
