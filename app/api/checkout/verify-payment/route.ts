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

// User-friendly error messages — never expose internals
const USER_ERRORS = {
  MISSING_FIELDS: 'Please fill in all required fields and complete the payment.',
  SIGNATURE_INVALID: 'Payment verification failed. If your money was deducted, our team has been notified and will resolve this within 24 hours. You can also contact us on WhatsApp.',
  SERVER_ERROR: 'Something went wrong on our end. Our team has been notified. If your payment was deducted, we will ensure your enrollment is completed. Please contact us if you need immediate assistance.',
  VERIFICATION_FAILED: 'We received your payment but encountered a verification issue. Our team has been notified and will contact you shortly to complete your enrollment.',
} as const;

export async function POST(request: NextRequest) {
  let customerEmail = '';
  let customerName = '';
  let customerPhone = '';
  let planId = '';
  let billing = 'full';
  let razorpay_payment_id = '';
  let razorpay_order_id = '';

  try {
    const body = await request.json();
    razorpay_payment_id = body.razorpay_payment_id || '';
    razorpay_order_id = body.razorpay_order_id || '';
    const razorpay_signature = body.razorpay_signature || '';
    customerName = body.name || '';
    customerEmail = body.email || '';
    customerPhone = body.phone || '';
    const city = body.city || '';
    planId = body.planId || '';
    billing = body.billing || 'full';

    // 1. Validate inputs
    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !city ||
      !planId
    ) {
      return NextResponse.json({ error: USER_ERRORS.MISSING_FIELDS }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('[Verify Payment] Razorpay secret key missing');
      await sendErrorAlert({
        errorType: 'payment-verification',
        errorMessage: 'RAZORPAY_KEY_SECRET is not configured in environment variables.',
        customerEmail,
        customerName,
        customerPhone,
        planId,
        billing,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        extra: 'CRITICAL: Customer has likely already paid. Manual enrollment required.',
      });
      return NextResponse.json({ error: USER_ERRORS.SERVER_ERROR }, { status: 500 });
    }

    // 2. Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('[Verify Payment] Signature mismatch');
      await sendErrorAlert({
        errorType: 'payment-verification',
        errorMessage: 'Razorpay signature verification failed. Possible tampered request or key mismatch.',
        customerEmail,
        customerName,
        customerPhone,
        planId,
        billing,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        extra: 'SECURITY: This could be a legitimate payment with a key rotation issue, or a tampered request. Verify on Razorpay Dashboard.',
      });
      return NextResponse.json({ error: USER_ERRORS.SIGNATURE_INVALID }, { status: 400 });
    }

    // 3. Initialize admin Supabase client using service role key (bypasses RLS constraints)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !key) {
      console.error('[Verify Payment] Supabase configuration missing');
      await sendErrorAlert({
        errorType: 'payment-verification',
        errorMessage: 'Supabase URL or Service Role Key is not configured. Payment was verified successfully but enrollment cannot proceed.',
        customerEmail,
        customerName,
        customerPhone,
        planId,
        billing,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        extra: 'CRITICAL: Payment signature verified OK. Customer paid but cannot be enrolled. Manual enrollment required.',
      });
      return NextResponse.json({ error: USER_ERRORS.VERIFICATION_FAILED }, { status: 500 });
    }

    const adminSupabase = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    let amountInRupees = 0;
    if (PLAN_PRICES[planId]) {
      const plan = PLAN_PRICES[planId];
      amountInRupees = billing === 'monthly' ? plan.monthly : plan.full;
    } else {
      const { data: course } = await adminSupabase
        .from('courses')
        .select('*')
        .eq('id', planId)
        .maybeSingle();
      if (course) {
        const price = Number(course.price || 0);
        if (billing === 'monthly') {
          const durationStr = course.duration || '3 Months';
          let divisor = 3;
          if (durationStr.includes('3')) divisor = 3;
          else if (durationStr.includes('4')) divisor = 4;
          else if (durationStr.includes('5')) divisor = 5;
          else if (durationStr.includes('6')) divisor = 6;
          else if (durationStr.toLowerCase().includes('week')) divisor = 1;
          amountInRupees = Math.ceil(price / divisor);
        } else {
          amountInRupees = price;
        }
      }
    }

    // 4. Save to payments table
    const { error: paymentError } = await adminSupabase.from('payments').insert({
      id: razorpay_payment_id,
      student_name: customerName,
      email: customerEmail,
      amount: amountInRupees,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
      method: 'Razorpay',
      status: 'success',
      phone: customerPhone,
      city: city,
    });

    if (paymentError) {
      console.error('[Verify Payment] Failed to save payment record:', paymentError.message);
      await sendErrorAlert({
        errorType: 'payment-verification',
        errorMessage: `Failed to save payment record to database: ${paymentError.message}`,
        customerEmail,
        customerName,
        customerPhone,
        planId,
        billing,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        extra: `Amount: ₹${amountInRupees}. Payment was captured by Razorpay but DB insert failed. Proceeding with enrollment attempt.`,
      });
      // Proceed anyway — we want to try enrolling the user even if payment logs fail
    }

    // 5. Account Setup & Course Enrollment
    // Check if student profile exists with this email
    const { data: existingProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', customerEmail)
      .maybeSingle();

    let studentId = existingProfile?.id;
    let tempPassword = generateSecurePassword(12);

    if (!studentId) {
      // Create user auth account
      const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
        email: customerEmail,
        email_confirm: true,
        password: tempPassword,
        user_metadata: { name: customerName, role: 'student' },
      });

      if (authError || !authUser.user) {
        console.error('[Verify Payment] Failed to create auth user:', authError?.message);
        await sendErrorAlert({
          errorType: 'account-setup',
          errorMessage: `Failed to create auth user: ${authError?.message || 'Unknown error'}`,
          customerEmail,
          customerName,
          customerPhone,
          planId,
          billing,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          extra: `Amount: ₹${amountInRupees}. Payment verified OK. Auth user creation failed — manual account setup required.`,
        });
      } else {
        studentId = authUser.user.id;

        // Create profile
        const { error: profileError } = await adminSupabase.from('profiles').insert({
          id: studentId,
          email: customerEmail,
          role: 'student',
          name: customerName,
          phone: customerPhone,
          location: city,
          needs_password_change: true,
        });

        if (profileError) {
          console.error('[Verify Payment] Failed to create profile:', profileError.message);
          await sendErrorAlert({
            errorType: 'account-setup',
            errorMessage: `Auth user created but profile insert failed: ${profileError.message}`,
            customerEmail,
            customerName,
            customerPhone,
            planId,
            billing,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            extra: `Student ID: ${studentId}. Auth user exists but profile row is missing.`,
          });
        }
      }
    } else {
      // Existing user: Update password and set needs_password_change flag
      const { error: updateError } = await adminSupabase.auth.admin.updateUserById(studentId, {
        password: tempPassword,
      });

      if (updateError) {
        console.error('[Verify Payment] Failed to update existing user password:', updateError.message);
        await sendErrorAlert({
          errorType: 'account-setup',
          errorMessage: `Failed to update password for existing user: ${updateError.message}`,
          customerEmail,
          customerName,
          planId,
          paymentId: razorpay_payment_id,
          extra: `Student ID: ${studentId}. Existing user, password reset failed.`,
        });
      } else {
        const { error: profileUpdateError } = await adminSupabase
          .from('profiles')
          .update({ needs_password_change: true })
          .eq('id', studentId);

        if (profileUpdateError) {
          console.error('[Verify Payment] Failed to update profile needs_password_change flag:', profileUpdateError.message);
        }
      }
    }

    // Send Welcome Email
    try {
      const origin = request.nextUrl.origin || 'http://localhost:3000';
      const emailSubject = 'Welcome to TESCA Spoken English! Your Student Account is Ready';

      const credentialsSection = `
        <div style="background: #fff8f8; border: 1px solid #fee2e2; border-radius: 12px; padding: 25px; margin: 25px 0;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #991b1b; font-weight: bold;">⚠️ IMPORTANT SECURITY DISCLAIMER:</p>
          <p style="margin: 0 0 15px 0; font-size: 13px; color: #7f1d1d; line-height: 1.5;">
            Do not share these credentials with anyone. For your security, when you log in with this temporary password for the first time, you will be required to change it to a password of your choice.
          </p>
          <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px;">
            <p style="margin: 5px 0; font-size: 14px; color: #111827;"><strong>Student Log In ID (Email):</strong> ${customerEmail}</p>
            <p style="margin: 5px 0; font-size: 14px; color: #111827;"><strong>Temporary Password:</strong> <code style="background: #fee2e2; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-family: monospace; font-size: 14px; color: #b91c1c;">${tempPassword}</code></p>
          </div>
        </div>
      `;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 40px 10px; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background-color: #0b3336; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">TESCA SPOKEN ENGLISH</h1>
            </div>
            <div style="padding: 40px 30px; line-height: 1.6;">
              <h2 style="color: #0b3336; margin-top: 0;">Welcome, ${customerName}!</h2>
              <p>Your payment of <strong>₹${amountInRupees.toLocaleString('en-IN')}</strong> has been successfully verified, and your enrollment is now active.</p>
              
              ${credentialsSection}
              
              <div style="text-align: center; margin: 30px 0 10px 0;">
                <a href="${origin}/login" style="background-color: #0b3336; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">Log In to Student Portal</a>
              </div>
            </div>
          </div>
        </div>
      `;

      await sendEmail(customerEmail, emailSubject, emailHtml);
    } catch (emailErr: any) {
      console.error('[Verify Payment] Failed to send welcome email:', emailErr);
      await sendErrorAlert({
        errorType: 'enrollment',
        errorMessage: `Welcome email failed to send: ${emailErr.message || String(emailErr)}`,
        customerEmail,
        customerName,
        planId,
        paymentId: razorpay_payment_id,
        extra: 'Payment and enrollment succeeded, but the student did not receive their login credentials via email. Manually send credentials.',
      });
    }

    // 6. Enroll student in the corresponding course
    if (studentId) {
      const courseId =
        planId === 'starter'
          ? 'spoken-english-intermediate'
          : planId === 'professional'
          ? 'business-communication'
          : planId === 'premium'
          ? 'vocabulary-accelerator'
          : planId;

      // Insert enrollment record
      const { error: enrollError } = await adminSupabase.from('enrollments').upsert({
        student_id: studentId,
        course_id: courseId,
        progress: 0,
        completed_lessons: 0,
        status: 'active',
      }, { onConflict: 'student_id,course_id' });

      if (enrollError) {
        console.error('[Verify Payment] Failed to create/update enrollment:', enrollError.message);
        await sendErrorAlert({
          errorType: 'enrollment',
          errorMessage: `Enrollment DB insert failed: ${enrollError.message}`,
          customerEmail,
          customerName,
          planId,
          paymentId: razorpay_payment_id,
          extra: `Student ID: ${studentId}, Course ID: ${courseId}. Payment verified, account created, but enrollment record failed. Manual enrollment required.`,
        });
      }
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('[Verify Payment] Unhandled error:', err);
    await sendErrorAlert({
      errorType: 'payment-verification',
      errorMessage: err.message || String(err),
      customerEmail,
      customerName,
      customerPhone,
      planId,
      billing,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      extra: err.stack ? err.stack.split('\n').slice(0, 5).join('\n') : undefined,
    });
    return NextResponse.json({ error: USER_ERRORS.SERVER_ERROR }, { status: 500 });
  }
}
