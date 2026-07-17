import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/gmail';
import crypto from 'crypto';
import { generateSecurePassword } from '@/lib/security';

const PLAN_PRICES: Record<string, { full: number; monthly: number }> = {
  starter: { full: 7999, monthly: 2667 },
  professional: { full: 12999, monthly: 3250 },
  premium: { full: 22999, monthly: 3834 },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      name,
      email,
      phone,
      city,
      planId,
      billing = 'full',
    } = body;

    // 1. Validate inputs
    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !name ||
      !email ||
      !phone ||
      !city ||
      !planId
    ) {
      return NextResponse.json({ error: 'Missing required payment validation inputs.' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Razorpay secret key is missing on the server.' }, { status: 500 });
    }

    // 2. Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed. Invalid signature.' }, { status: 400 });
    }

    // 3. Initialize admin Supabase client using service role key (bypasses RLS constraints)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase configuration is missing on the server.' }, { status: 500 });
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
      student_name: name,
      email: email,
      amount: amountInRupees,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
      method: 'Razorpay',
      status: 'success',
      phone: phone,
      city: city,
    });

    if (paymentError) {
      console.error('[Verify API] Failed to save payment:', paymentError.message);
      // Proceed anyway, we want to try enrolling the user even if payment logs fail
    }

    // 5. Account Setup & Course Enrollment
    // Check if student profile exists with this email
    const { data: existingProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    let studentId = existingProfile?.id;
    let tempPassword = generateSecurePassword(12);

    if (!studentId) {
      // Create user auth account
      const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
        email: email,
        email_confirm: true,
        password: tempPassword,
        user_metadata: { name, role: 'student' },
      });

      if (authError || !authUser.user) {
        console.error('[Verify API] Failed to create auth user:', authError?.message);
      } else {
        studentId = authUser.user.id;

        // Create profile
        const { error: profileError } = await adminSupabase.from('profiles').insert({
          id: studentId,
          email: email,
          role: 'student',
          name: name,
          phone: phone,
          location: city,
          needs_password_change: true,
        });

        if (profileError) {
          console.error('[Verify API] Failed to create profile:', profileError.message);
        }
      }
    } else {
      // Existing user: Update password and set needs_password_change flag
      const { error: updateError } = await adminSupabase.auth.admin.updateUserById(studentId, {
        password: tempPassword,
      });

      if (updateError) {
        console.error('[Verify API] Failed to update existing user password:', updateError.message);
      } else {
        const { error: profileUpdateError } = await adminSupabase
          .from('profiles')
          .update({ needs_password_change: true })
          .eq('id', studentId);

        if (profileUpdateError) {
          console.error('[Verify API] Failed to update profile needs_password_change flag:', profileUpdateError.message);
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
            <p style="margin: 5px 0; font-size: 14px; color: #111827;"><strong>Student Log In ID (Email):</strong> ${email}</p>
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
              <h2 style="color: #0b3336; margin-top: 0;">Welcome, ${name}!</h2>
              <p>Your payment of <strong>₹${amountInRupees.toLocaleString('en-IN')}</strong> has been successfully verified, and your enrollment is now active.</p>
              
              ${credentialsSection}
              
              <div style="text-align: center; margin: 30px 0 10px 0;">
                <a href="${origin}/login" style="background-color: #0b3336; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">Log In to Student Portal</a>
              </div>
            </div>
          </div>
        </div>
      `;

      await sendEmail(email, emailSubject, emailHtml);
    } catch (emailErr) {
      console.error('[Verify API] Failed to send welcome email:', emailErr);
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
        console.error('[Verify API] Failed to create/update enrollment:', enrollError.message);
      }
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('[Verify Payment API Error]:', err);
    return NextResponse.json({ error: 'An error occurred during verification.' }, { status: 500 });
  }
}
