import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/gmail';
import crypto from 'crypto';
import { generateSecurePassword } from '@/lib/security';
import { sendErrorAlert } from '@/lib/error-alerts';

const PLAN_PRICES: Record<string, { full: number; monthly: number }> = {
  starter: { full: 7999, monthly: 2667 },
  professional: { full: 12999, monthly: 3250 },
  premium: { full: 22999, monthly: 3834 },
};

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function resolveCourseId(planId: string): string {
  return planId === 'starter'
    ? 'spoken-english-intermediate'
    : planId === 'professional'
    ? 'business-communication'
    : planId === 'premium'
    ? 'vocabulary-accelerator'
    : planId;
}

/**
 * Razorpay Webhook Handler
 * 
 * This endpoint receives server-to-server POST calls from Razorpay for payment events.
 * It acts as a safety net for cases where the user's browser closes mid-payment.
 * 
 * Configure in Razorpay Dashboard → Settings → Webhooks:
 * - URL: https://tesca.co/api/checkout/webhook
 * - Events: payment.captured, payment.failed
 * - Secret: Set as RAZORPAY_WEBHOOK_SECRET in env
 */
export async function POST(request: NextRequest) {
  let paymentId = '';
  let orderId = '';

  try {
    // 1. Read raw body for signature verification
    const rawBody = await request.text();
    const webhookSignature = request.headers.get('x-razorpay-signature') || '';
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // If no webhook secret configured, fall back to key secret (less ideal but functional)
    const secret = webhookSecret || process.env.RAZORPAY_KEY_SECRET || '';

    if (!secret) {
      console.error('[Webhook] No webhook or key secret configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 2. Verify webhook signature
    if (webhookSignature) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== webhookSignature) {
        console.error('[Webhook] Signature mismatch — possible tampered request');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    // 3. Parse event
    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload?.payment?.entity;

    if (!payload) {
      return NextResponse.json({ status: 'ignored', reason: 'No payment entity in payload' });
    }

    paymentId = payload.id || '';
    orderId = payload.order_id || '';
    const amount = payload.amount || 0; // in paise
    const amountInRupees = Math.round(amount / 100);
    const email = payload.email || payload.notes?.email || '';
    const phone = payload.contact || '';
    const name = payload.notes?.name || '';
    const planId = payload.notes?.planId || '';
    const billing = payload.notes?.billing || 'full';
    const city = payload.notes?.city || '';

    console.log(`[Webhook] Received event: ${eventType} | Payment: ${paymentId} | Order: ${orderId}`);

    // 4. Handle payment.captured — the critical case
    if (eventType === 'payment.captured' || eventType === 'payment.authorized') {
      const adminSupabase = getAdminSupabase();
      if (!adminSupabase) {
        console.error('[Webhook] Supabase not configured');
        await sendErrorAlert({
          errorType: 'payment-verification',
          errorMessage: 'Webhook received payment.captured but Supabase is not configured.',
          customerEmail: email,
          customerName: name,
          paymentId,
          orderId,
          planId,
          extra: `Amount: ₹${amountInRupees}. CRITICAL: Manual enrollment required.`,
        });
        return NextResponse.json({ status: 'error' }, { status: 500 });
      }

      // Check if this payment was already processed (idempotency)
      const { data: existingPayment } = await adminSupabase
        .from('payments')
        .select('id')
        .eq('id', paymentId)
        .maybeSingle();

      if (existingPayment) {
        console.log(`[Webhook] Payment ${paymentId} already processed — skipping (idempotent)`);
        return NextResponse.json({ status: 'already_processed' });
      }

      // Payment not yet in our DB — this is the "browser closed" case
      console.log(`[Webhook] Payment ${paymentId} not in DB — processing enrollment via webhook fallback`);

      // Insert payment record
      const { error: payInsertErr } = await adminSupabase.from('payments').insert({
        id: paymentId,
        student_name: name || 'Webhook Recovery',
        email: email,
        amount: amountInRupees,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
        method: 'Razorpay',
        status: 'success',
        phone: phone,
        city: city || 'N/A',
      });

      if (payInsertErr) {
        console.error('[Webhook] Failed to insert payment:', payInsertErr.message);
        await sendErrorAlert({
          errorType: 'payment-verification',
          errorMessage: `Webhook payment insert failed: ${payInsertErr.message}`,
          customerEmail: email,
          customerName: name,
          paymentId,
          orderId,
          planId,
          extra: `Amount: ₹${amountInRupees}. Payment captured by Razorpay. DB insert failed.`,
        });
      }

      // Only proceed with enrollment if we have an email
      if (email) {
        // Check if profile exists
        const { data: existingProfile } = await adminSupabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        let studentId = existingProfile?.id;
        const tempPassword = generateSecurePassword(12);

        if (!studentId) {
          // Create auth user
          const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
            email,
            email_confirm: true,
            password: tempPassword,
            user_metadata: { name: name || 'Student', role: 'student' },
          });

          if (authError || !authUser.user) {
            console.error('[Webhook] Failed to create auth user:', authError?.message);
            await sendErrorAlert({
              errorType: 'account-setup',
              errorMessage: `Webhook: Auth user creation failed: ${authError?.message}`,
              customerEmail: email,
              customerName: name,
              paymentId,
              orderId,
              planId,
              extra: `Amount: ₹${amountInRupees}. Manual account setup required.`,
            });
          } else {
            studentId = authUser.user.id;
            await adminSupabase.from('profiles').insert({
              id: studentId,
              email,
              role: 'student',
              name: name || 'Student',
              phone,
              location: city || 'N/A',
              needs_password_change: true,
            });
          }
        } else {
          // Existing user — reset password
          await adminSupabase.auth.admin.updateUserById(studentId, { password: tempPassword });
          await adminSupabase.from('profiles').update({ needs_password_change: true }).eq('id', studentId);
        }

        // Enroll in course
        if (studentId && planId) {
          const courseId = resolveCourseId(planId);
          await adminSupabase.from('enrollments').upsert({
            student_id: studentId,
            course_id: courseId,
            progress: 0,
            completed_lessons: 0,
            status: 'active',
          }, { onConflict: 'student_id,course_id' });
        }

        // Send welcome email
        try {
          const origin = 'https://tesca.co';
          const emailSubject = 'Welcome to TESCA Spoken English! Your Student Account is Ready';
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 40px 10px; color: #1f2937;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
                <div style="background-color: #0b3336; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">TESCA SPOKEN ENGLISH</h1>
                </div>
                <div style="padding: 40px 30px; line-height: 1.6;">
                  <h2 style="color: #0b3336; margin-top: 0;">Welcome, ${name || 'Student'}!</h2>
                  <p>Your payment of <strong>₹${amountInRupees.toLocaleString('en-IN')}</strong> has been successfully received and your enrollment is now active.</p>
                  <div style="background: #fff8f8; border: 1px solid #fee2e2; border-radius: 12px; padding: 25px; margin: 25px 0;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #991b1b; font-weight: bold;">⚠️ IMPORTANT SECURITY DISCLAIMER:</p>
                    <p style="margin: 0 0 15px 0; font-size: 13px; color: #7f1d1d; line-height: 1.5;">
                      Do not share these credentials with anyone. When you log in for the first time, you will be required to change your password.
                    </p>
                    <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px;">
                      <p style="margin: 5px 0; font-size: 14px; color: #111827;"><strong>Email:</strong> ${email}</p>
                      <p style="margin: 5px 0; font-size: 14px; color: #111827;"><strong>Temporary Password:</strong> <code style="background: #fee2e2; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-family: monospace; font-size: 14px; color: #b91c1c;">${tempPassword}</code></p>
                    </div>
                  </div>
                  <div style="text-align: center; margin: 30px 0 10px 0;">
                    <a href="${origin}/login" style="background-color: #0b3336; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">Log In to Student Portal</a>
                  </div>
                </div>
              </div>
            </div>
          `;
          await sendEmail(email, emailSubject, emailHtml);
          console.log(`[Webhook] Welcome email sent to ${email}`);
        } catch (emailErr) {
          console.error('[Webhook] Failed to send welcome email:', emailErr);
          await sendErrorAlert({
            errorType: 'enrollment',
            errorMessage: `Webhook: Welcome email failed: ${String(emailErr)}`,
            customerEmail: email,
            paymentId,
            extra: 'Enrollment succeeded but credentials email was not sent. Manually send credentials.',
          });
        }

        // Notify admin about webhook-recovered payment
        await sendErrorAlert({
          errorType: 'general',
          errorMessage: 'Payment was recovered via Razorpay webhook (user\'s browser likely closed during checkout). Enrollment has been completed automatically.',
          customerEmail: email,
          customerName: name,
          customerPhone: phone,
          paymentId,
          orderId,
          planId,
          billing,
          extra: `Amount: ₹${amountInRupees}. This is an informational alert — no action required unless the student reports issues.`,
        });
      }

      return NextResponse.json({ status: 'processed' });
    }

    // 5. Handle payment.failed
    if (eventType === 'payment.failed') {
      console.log(`[Webhook] Payment failed: ${paymentId} | Reason: ${payload.error_description || 'unknown'}`);
      // No action needed — the user already sees the failure in their browser
      return NextResponse.json({ status: 'noted' });
    }

    // 6. Other events — acknowledge without processing
    console.log(`[Webhook] Ignoring event type: ${eventType}`);
    return NextResponse.json({ status: 'ignored' });

  } catch (err: any) {
    console.error('[Webhook] Unhandled error:', err);
    await sendErrorAlert({
      errorType: 'general',
      errorMessage: `Razorpay webhook handler crashed: ${err.message || String(err)}`,
      paymentId,
      orderId,
      extra: err.stack ? err.stack.split('\n').slice(0, 5).join('\n') : undefined,
    });
    // Always return 200 to prevent Razorpay from retrying endlessly on a code bug
    return NextResponse.json({ status: 'error_logged' });
  }
}
