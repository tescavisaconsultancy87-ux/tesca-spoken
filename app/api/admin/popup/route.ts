import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAuthAndRole, checkRateLimit, formatFriendlyError } from '@/lib/security';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// 1. GET: Fetch all popups (ordered by id desc)
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 30, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const auth = await verifyAuthAndRole(request, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Access denied.' }, { status: auth.status || 401 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json([]);
      }
      return NextResponse.json({ error: 'Server configuration incomplete.' }, { status: 500 });
    }

    const { data, error } = await adminClient
      .from('popup_settings')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('[Admin Popup GET] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}

// 2. POST: Create new popup settings
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 30, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const auth = await verifyAuthAndRole(request, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Access denied.' }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { is_active, image_url, title, subtitle, delay_seconds, button_text, link_url, lead_capture_enabled, required_fields } = body;

    if (!image_url || !title) {
      return NextResponse.json({ error: 'Image URL and Title are required.' }, { status: 400 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Server configuration incomplete.' }, { status: 500 });
    }

    const { data, error } = await adminClient
      .from('popup_settings')
      .insert({
        is_active: !!is_active,
        image_url,
        title,
        subtitle: subtitle || '',
        delay_seconds: parseInt(delay_seconds, 10) || 5,
        button_text: button_text || 'Get Details',
        link_url: link_url || '',
        lead_capture_enabled: !!lead_capture_enabled,
        required_fields: required_fields || ['name', 'phone']
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[Admin Popup POST] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}

// 3. PATCH: Update popup settings
export async function PATCH(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 30, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const auth = await verifyAuthAndRole(request, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Access denied.' }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { id, is_active, image_url, title, subtitle, delay_seconds, button_text, link_url, lead_capture_enabled, required_fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'Popup id is required.' }, { status: 400 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Server configuration incomplete.' }, { status: 500 });
    }

    const updates: any = {};
    if (is_active !== undefined) updates.is_active = !!is_active;
    if (image_url !== undefined) updates.image_url = image_url;
    if (title !== undefined) updates.title = title;
    if (subtitle !== undefined) updates.subtitle = subtitle;
    if (delay_seconds !== undefined) updates.delay_seconds = parseInt(delay_seconds, 10) || 5;
    if (button_text !== undefined) updates.button_text = button_text;
    if (link_url !== undefined) updates.link_url = link_url;
    if (lead_capture_enabled !== undefined) updates.lead_capture_enabled = !!lead_capture_enabled;
    if (required_fields !== undefined) updates.required_fields = required_fields;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await adminClient
      .from('popup_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[Admin Popup PATCH] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}

// 4. DELETE: Delete popup settings
export async function DELETE(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 30, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    const auth = await verifyAuthAndRole(request, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Access denied.' }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Popup id is required.' }, { status: 400 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Server configuration incomplete.' }, { status: 500 });
    }

    const { error } = await adminClient
      .from('popup_settings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Admin Popup DELETE] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}
