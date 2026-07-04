import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAuthAndRole, checkRateLimit, formatFriendlyError } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 15, 60000); // Max 15 edits/min
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    // 2. Authentication & Authorization Guard (Only admin allowed to edit accounts)
    const auth = await verifyAuthAndRole(request, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Access denied.' },
        { status: auth.status || 401 }
      );
    }

    // 3. Parse and validate request body
    const body = await request.json();
    const { userId, name, email, phone, role, course } = body;

    if (!userId || !name || !email || !role || !phone) {
      return NextResponse.json(
        { error: 'userId, name, email, role, and phone are required.' },
        { status: 400 }
      );
    }

    // Validate phone number: must be exactly 10 digits
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      return NextResponse.json(
        { error: 'Phone number must be exactly 10 digits.' },
        { status: 400 }
      );
    }

    // Initialize service-role admin client to bypass RLS and edit auth accounts
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

    if (!supabaseUrl || !serviceRoleKey) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Edit User] No service-role key. Dev sandbox — accepting user edit without DB write.');
        console.log(`[Edit User] Dev: would edit user ID: ${userId} to name: ${name}, email: ${email}`);
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

    // 4. Update the user in Supabase Auth
    const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
      email,
      user_metadata: {
        name,
        role,
        phone,
      },
    });

    if (authError) {
      console.error('[Edit User] Auth update failed:', authError.message);
      return NextResponse.json(
        { error: `Auth update failed: ${authError.message}` },
        { status: 400 }
      );
    }

    // 5. Update the user in profiles table
    const profileUpdates: any = {
      name,
      email,
      phone,
      role,
    };

    if (role === 'student') {
      // Map the course selection back to a level representation
      // We clean the "Spoken English — " prefix to match database mapping
      profileUpdates.level = course.replace(/^Spoken English\s*—\s*/i, '');
    } else {
      profileUpdates.level = 'Expert';
    }

    const { error: profileError } = await adminClient
      .from('profiles')
      .update(profileUpdates)
      .eq('id', userId);

    if (profileError) {
      console.error('[Edit User] Profile update failed:', profileError.message);
      return NextResponse.json(
        { error: `Profile update failed: ${profileError.message}` },
        { status: 400 }
      );
    }

    // 6. Handle enrollment course change if student
    if (role === 'student' && course) {
      const courseId = course.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Check if student is already enrolled in this course
      const { data: existingEnrollment } = await adminClient
        .from('enrollments')
        .select('*')
        .eq('student_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (!existingEnrollment) {
        // Deactivate/delete previous enrollments (or delete to clean up, depending on logic)
        // Let's delete to make it clean as this is an administrative edit
        await adminClient
          .from('enrollments')
          .delete()
          .eq('student_id', userId);

        // Insert new enrollment
        const { error: enrollError } = await adminClient
          .from('enrollments')
          .insert({
            student_id: userId,
            course_id: courseId,
            status: 'active',
          });

        if (enrollError) {
          console.error('[Edit User] New course enrollment failed:', enrollError.message);
        }
      }
    }

    // Audit Logging
    console.log(
      `[Audit] User Updated by ${auth.user?.email} (${auth.user?.role}): ` +
      `userId=${userId}, email=${email}, name=${name}, role=${role}`
    );

    return NextResponse.json({
      success: true,
      userId,
      email,
      name,
      role,
    });
  } catch (error: any) {
    console.error('[Edit User] Error:', error);
    return NextResponse.json(
      { error: formatFriendlyError(error) },
      { status: 500 }
    );
  }
}
