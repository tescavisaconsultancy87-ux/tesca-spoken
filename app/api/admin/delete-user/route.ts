import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAuthAndRole, checkRateLimit, formatFriendlyError } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 10, 60000); // Max 10 user deletions/min
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    // 2. Authentication & Authorization Guard (Only admin allowed to delete accounts)
    const auth = await verifyAuthAndRole(request, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Access denied.' },
        { status: auth.status || 401 }
      );
    }

    // 3. Parse and validate request body
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required.' },
        { status: 400 }
      );
    }

    // Prevent self-deletion of the active administrator
    if (auth.user && auth.user.id === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own admin account. Please ask another administrator to do so.' },
        { status: 403 }
      );
    }

    // 4. Initialize service-role admin client to bypass RLS and delete auth accounts
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

    if (!supabaseUrl || !serviceRoleKey) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Delete User] No service-role key. Dev sandbox — accepting user deletion without DB write.');
        console.log(`[Delete User] Dev: would delete user ID: ${userId}`);
        return NextResponse.json({ success: true, dev: true, userId });
      }
      return NextResponse.json(
        { error: 'Server configuration incomplete. Contact support.' },
        { status: 500 }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 5. Retrieve target user's details for auditing
    const { data: existingProfile, error: fetchError } = await adminClient
      .from('profiles')
      .select('id, email, name, role')
      .eq('id', userId)
      .maybeSingle();

    const userEmail = existingProfile?.email || 'Unknown Email';
    const userName = existingProfile?.name || 'Unknown Name';
    const userRole = existingProfile?.role || 'student';

    // 6. Delete target user from Supabase Auth
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId);
    
    // Ignore "User not found" from Auth in case there's a discrepancy (orphaned DB profiles)
    if (authError && !authError.message.toLowerCase().includes('user not found')) {
      console.error('[Delete User] Auth deletion failed:', authError.message);
      return NextResponse.json(
        { error: `Auth deletion failed: ${authError.message}` },
        { status: 500 }
      );
    }

    // 7. Explicitly delete from profiles table (cascade delete might handle this, but run explicitly to clean orphans)
    const { error: profileError } = await adminClient
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('[Delete User] Profile deletion failed:', profileError.message);
      return NextResponse.json(
        { error: `Profile deletion failed: ${profileError.message}` },
        { status: 500 }
      );
    }

    // 8. Audit logging
    console.log(
      `[Audit] User Deleted by ${auth.user?.email} (${auth.user?.role}): ` +
      `user=${userEmail} (${userId}), name=${userName}, role=${userRole}`
    );

    return NextResponse.json({
      success: true,
      userId,
      email: userEmail,
      name: userName,
      role: userRole,
    });
  } catch (error: any) {
    console.error('[Delete User] Error:', error);
    return NextResponse.json(
      { error: formatFriendlyError(error) },
      { status: 500 }
    );
  }
}
