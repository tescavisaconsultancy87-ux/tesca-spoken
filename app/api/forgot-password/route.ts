import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/gmail';
import { checkRateLimit, getClientIp, secureRandomInt } from '@/lib/security';

// Create a Supabase admin client using the service role key to bypass RLS
const getAdminSupabase = () => {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!url || !serviceKey) {
    throw new Error('Supabase URL or Service Role Key is missing in environment variables.');
  }
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

const GENERIC_RESET_RESPONSE = {
  success: true,
  message: 'If this email is registered, a verification code has been sent.'
};

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function isValidPassword(password: string): boolean {
  return password.length >= 8
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password)
    && /\d/.test(password);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, otp, password } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const ip = getClientIp(request);
    const rateKey = `forgot-password:${ip}:${cleanEmail}`;
    const rateCheck = checkRateLimit(rateKey, 5, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ success: false, error: 'Too many reset attempts. Please wait before trying again.' }, { status: 429 });
    }

    const supabaseAdmin = getAdminSupabase();

    // ─── ACTION 1: SEND OTP ───
    if (action === 'send-otp') {
      // 1. Verify email registration in profiles
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (profileError || !profile) {
        return NextResponse.json(GENERIC_RESET_RESPONSE);
      }

      // 2. Generate and store a hashed 6-digit OTP code
      const otpCode = secureRandomInt(100000, 1000000).toString();
      const otpHash = await sha256Hex(otpCode);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes validity

      // 3. Store the OTP in the user's profile
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          reset_otp: otpHash,
          reset_otp_expires_at: expiresAt,
        })
        .eq('email', cleanEmail);

      if (updateError) {
        console.error('[Send OTP] Database update error:', updateError);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to generate security verification code. Please try again.' 
        }, { status: 500 });
      }

      // 4. Send email containing the OTP
      const subject = 'Your Password Reset OTP Code - TESCA';
      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #0b3336; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">TESCA Spoken English</h2>
            <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Password Recovery Verification</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <div style="color: #334155; font-size: 14px; line-height: 1.6; space-y-4;">
            <p>Hello,</p>
            <p>We received a request to reset the password for your TESCA account. Please use the following One-Time Password (OTP) code to verify your identity and complete the process:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0b3336; background-color: #f0fdfa; padding: 12px 28px; border-radius: 12px; border: 1px dashed #0d9488; display: inline-block; font-family: monospace;">
                ${otpCode}
              </span>
            </div>
            
            <p style="color: #e11d48; font-weight: 700; font-size: 13px; text-align: center; background-color: #fff1f2; padding: 8px 12px; border-radius: 8px; border: 1px solid #ffe4e6;">
              ⚠️ This security code is valid for 5 minutes only.
            </p>
            
            <p style="margin-top: 24px;">If you did not make this request, you can safely ignore this email. Your current password will remain secure.</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          <div style="text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.5;">
            <p>This is an automated security transmission. Please do not reply directly to this email.</p>
            <p style="margin-top: 8px;">© 2026 TESCA Spoken English. All rights reserved.</p>
          </div>
        </div>
      `;

      const mailResult = await sendEmail(cleanEmail, subject, htmlBody);
      if (!mailResult.success) {
        console.error('[Send OTP] Mail delivery failed:', mailResult.error);
        return NextResponse.json({ 
          success: false, 
          error: 'Could not deliver recovery email. Please check your network or try again.' 
        }, { status: 500 });
      }

      return NextResponse.json(GENERIC_RESET_RESPONSE);
    }

    // ─── ACTION 2: VERIFY OTP ───
    if (action === 'verify-otp') {
      if (!otp) {
        return NextResponse.json({ success: false, error: 'Verification code is required.' }, { status: 400 });
      }

      const cleanOtp = otp.trim();
      const otpHash = await sha256Hex(cleanOtp);

      // 1. Fetch OTP and expiration from profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('reset_otp, reset_otp_expires_at')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (profileError || !profile || !profile.reset_otp) {
        return NextResponse.json({ success: false, error: 'Invalid verification code. Please check and try again.' }, { status: 400 });
      }

      if (profile.reset_otp !== otpHash) {
        return NextResponse.json({ success: false, error: 'Invalid verification code. Please check and try again.' }, { status: 400 });
      }

      if (new Date(profile.reset_otp_expires_at) < new Date()) {
        return NextResponse.json({ success: false, error: 'This verification code has expired (valid for 5 minutes). Please request a new code.' }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: 'Verification code validated successfully.' });
    }

    // ─── ACTION 3: RESET PASSWORD ───
    if (action === 'reset-password') {
      if (!otp) {
        return NextResponse.json({ success: false, error: 'Verification code is required.' }, { status: 400 });
      }
      if (!password || typeof password !== 'string') {
        return NextResponse.json({ success: false, error: 'New password is required.' }, { status: 400 });
      }
      if (!isValidPassword(password)) {
        return NextResponse.json({ success: false, error: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.' }, { status: 400 });
      }

      const cleanOtp = otp.trim();
      const otpHash = await sha256Hex(cleanOtp);

      // 1. Double check OTP is correct and not expired
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, reset_otp, reset_otp_expires_at')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (profileError || !profile) {
        return NextResponse.json({ success: false, error: 'Verification credentials mismatch. Please start over.' }, { status: 400 });
      }

      if (!profile.reset_otp || profile.reset_otp !== otpHash) {
        return NextResponse.json({ success: false, error: 'Verification credentials mismatch. Please start over.' }, { status: 400 });
      }

      if (new Date(profile.reset_otp_expires_at) < new Date()) {
        return NextResponse.json({ success: false, error: 'Verification code expired. Please request a new one.' }, { status: 400 });
      }

      // 2. Perform password update in Auth
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
        password: password,
      });

      if (authError) {
        console.error('[Reset Password] Supabase Auth update failed:', authError);
        return NextResponse.json({ success: false, error: authError.message }, { status: 400 });
      }

      // 3. Clear OTP columns in DB
      await supabaseAdmin
        .from('profiles')
        .update({
          reset_otp: null,
          reset_otp_expires_at: null,
        })
        .eq('id', profile.id);

      return NextResponse.json({ success: true, message: 'Your password has been reset successfully.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action parameter.' }, { status: 400 });
  } catch (err: any) {
    console.error('[Reset Password API Route Error]:', err);
    return NextResponse.json({ success: false, error: 'An unexpected server error occurred.' }, { status: 500 });
  }
}
