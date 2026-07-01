import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAuthAndRole, checkRateLimit, formatFriendlyError } from '@/lib/security';

const VALID_ROLES = ['student', 'tutor', 'admin'] as const;
type ValidRole = (typeof VALID_ROLES)[number];

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 10, 60000); // Max 10 role changes/min
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    // 2. Auth & Authorization — only admins can change roles
    const auth = await verifyAuthAndRole(request, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Access denied.' },
        { status: auth.status || 401 }
      );
    }

    // 3. Parse & validate request body
    const body = await request.json();
    const { userId, newRole } = body;

    if (!userId || !newRole) {
      return NextResponse.json(
        { error: 'userId and newRole are required.' },
        { status: 400 }
      );
    }

    if (!VALID_ROLES.includes(newRole)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      );
    }

    // Prevent self-demotion of the last admin (safety net)
    if (auth.user && auth.user.id === userId && newRole !== 'admin') {
      return NextResponse.json(
        { error: 'You cannot change your own admin role. Ask another admin to do it.' },
        { status: 403 }
      );
    }

    // 4. Use service-role client to bypass RLS (the anon key can no longer change roles)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

    if (!supabaseUrl || !serviceRoleKey) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Update Role] No service-role key. Dev sandbox — accepting role change without DB write.');
        console.log(`[Update Role] Dev: would change user ${userId} to role ${newRole}`);
        return NextResponse.json({ success: true, dev: true, userId, newRole });
      }
      return NextResponse.json(
        { error: 'Server configuration incomplete. Contact support.' },
        { status: 500 }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 5. Verify target user exists
    const { data: existingProfile, error: fetchError } = await adminClient
      .from('profiles')
      .select('id, email, name, role')
      .eq('id', userId)
      .single();

    if (fetchError || !existingProfile) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    const previousRole = existingProfile.role;

    // No-op if role is the same
    if (previousRole === newRole) {
      return NextResponse.json({ success: true, message: 'Role is already set to ' + newRole, userId, previousRole, newRole });
    }

    // 6. Update the role
    const { error: updateError } = await adminClient
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (updateError) {
      console.error('[Update Role] Failed:', updateError.message);
      return NextResponse.json(
        { error: 'Failed to update role. Please try again.' },
        { status: 500 }
      );
    }

    // 7. Audit log
    console.log(
      `[Audit] Role changed by ${auth.user?.email} (${auth.user?.role}): ` +
      `user=${existingProfile.email} (${userId}), ` +
      `${previousRole} → ${newRole}`
    );

    return NextResponse.json({
      success: true,
      userId,
      email: existingProfile.email,
      name: existingProfile.name,
      previousRole,
      newRole,
    });
  } catch (error: any) {
    console.error('[Update Role] Error:', error);
    return NextResponse.json(
      { error: formatFriendlyError(error) },
      { status: 500 }
    );
  }
}
