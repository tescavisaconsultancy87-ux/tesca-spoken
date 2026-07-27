import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Check if a user is already enrolled in a course.
 * Used by the frontend before showing the payment form.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, planId } = body;

    if (!email || !planId) {
      return NextResponse.json({ enrolled: false });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !key) {
      // Can't check — let them proceed
      return NextResponse.json({ enrolled: false });
    }

    const adminSupabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Find profile by email
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ enrolled: false });
    }

    // Resolve course ID from plan ID
    const courseId =
      planId === 'starter'
        ? 'spoken-english-intermediate'
        : planId === 'professional'
        ? 'business-communication'
        : planId === 'premium'
        ? 'vocabulary-accelerator'
        : planId;

    // Check enrollment
    const { data: enrollment } = await adminSupabase
      .from('enrollments')
      .select('status')
      .eq('student_id', profile.id)
      .eq('course_id', courseId)
      .eq('status', 'active')
      .maybeSingle();

    return NextResponse.json({
      enrolled: !!enrollment,
    });
  } catch (err: any) {
    console.error('[Check Enrollment] Error:', err.message);
    // On error, let them proceed — don't block payment
    return NextResponse.json({ enrolled: false });
  }
}
