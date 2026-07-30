import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAuthAndRole, checkRateLimit, getClientIp } from '@/lib/security';

/**
 * Payment Status Check API (Authenticated)
 * Users can only check their own payment status.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, 10, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait before trying again.' }, { status: 429 });
    }

    const auth = await verifyAuthAndRole(request, ['student', 'admin', 'tutor']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    const { email, paymentId } = body;

    if (!email && !paymentId) {
      return NextResponse.json({
        error: 'Please provide your email address or payment ID to check status.',
      }, { status: 400 });
    }

    // Ownership check: users can only query their own email
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    if (cleanEmail && cleanEmail !== auth.user.email.toLowerCase()) {
      return NextResponse.json({ error: 'You can only check your own payment status.' }, { status: 403 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !key) {
      return NextResponse.json({
        error: 'Unable to check payment status right now. Please contact us on WhatsApp for assistance.',
      }, { status: 500 });
    }

    const adminSupabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let query = adminSupabase
      .from('payments')
      .select('id, student_name, email, amount, date, status, method')
      .order('created_at', { ascending: false })
      .limit(5);

    if (paymentId) {
      // When querying by payment ID, also verify ownership
      query = query.eq('id', paymentId.trim()).eq('email', auth.user.email);
    } else {
      query = query.eq('email', cleanEmail);
    }

    const { data: payments, error } = await query;

    if (error) {
      console.error('[Payment Status] DB query error:', error.message);
      return NextResponse.json({
        error: 'Unable to check payment status right now. Please try again later.',
      }, { status: 500 });
    }

    if (!payments || payments.length === 0) {
      return NextResponse.json({
        found: false,
        message: 'No payment records found.',
      });
    }

    // Check enrollment status for the latest payment
    let enrollmentActive = false;
    const latestPayment = payments[0];
    if (latestPayment.email) {
      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('id')
        .eq('email', latestPayment.email)
        .maybeSingle();

      if (profile) {
        const { data: enrollment } = await adminSupabase
          .from('enrollments')
          .select('status')
          .eq('student_id', profile.id)
          .eq('status', 'active')
          .limit(1)
          .maybeSingle();

        enrollmentActive = !!enrollment;
      }
    }

    // Return sanitized payment info
    return NextResponse.json({
      found: true,
      payments: payments.map((p) => ({
        paymentId: p.id,
        name: p.student_name,
        amount: p.amount,
        date: p.date,
        status: p.status,
        method: p.method,
      })),
      enrollmentActive,
    });
  } catch (err: any) {
    console.error('[Payment Status] Unhandled error:', err.message);
    return NextResponse.json({
      error: 'Something went wrong. Please contact us on WhatsApp for assistance.',
    }, { status: 500 });
  }
}
