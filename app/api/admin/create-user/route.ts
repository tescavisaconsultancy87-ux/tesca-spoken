import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/gmail';
import { supabase } from '@/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { verifyAuthAndRole, checkRateLimit, formatFriendlyError, generateSecurePassword, getClientIp } from '@/lib/security';

// Helper to find a user by email in Supabase Auth
async function findAuthUserByEmail(adminSupabase: any, email: string): Promise<any | null> {
  let page = 1;
  const perPage = 100;
  while (true) {
    const { data, error } = await adminSupabase.auth.admin.listUsers({
      page,
      perPage
    });
    if (error || !data?.users || data.users.length === 0) {
      break;
    }
    const user = data.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
    if (user) {
      return user;
    }
    if (data.users.length < perPage) {
      break;
    }
    page++;
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, 10, 60000); // Max 10 creations/min
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before creating more users.' },
        { status: 429 }
      );
    }

    // 2. Authentication & Authorization Guard (Only admin allowed)
    const auth = await verifyAuthAndRole(request, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Access denied.' },
        { status: auth.status || 401 }
      );
    }

    const body = await request.json();
    const { name, email, role, phone, course } = body;

    // Validation checks
    if (!name || !email || !role || !phone) {
      return NextResponse.json(
        { error: 'Name, email, role, and phone number are required.' },
        { status: 400 }
      );
    }

    // Phone validation: must be exactly 10 digits
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      return NextResponse.json(
        { error: 'Phone number must be exactly 10 digits.' },
        { status: 400 }
      );
    }

    const password = generateSecurePassword(12);
    const appName = process.env.APP_NAME || 'tesca-spoken';

    let databaseSaved = false;
    let authUserId = `mock-id-${Date.now()}`;

    // Initialize admin client if service role key is present
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const adminSupabase = (supabaseUrl && serviceRoleKey)
      ? createClient(supabaseUrl, serviceRoleKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        })
      : null;

    // If Supabase is configured, create the user
    if (adminSupabase) {
      console.log('[Create User] Using Supabase Admin Client (Service Role)...');
      // 1. Create the user in Supabase auth (pre-confirmed, bypasses client session login)
      const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          role,
          phone,
        },
      });

      if (authError) {
        const errorMsg = authError.message.toLowerCase();
        if (
          errorMsg.includes('already registered') ||
          errorMsg.includes('already exists') ||
          errorMsg.includes('already been registered')
        ) {
          console.log('[Create User] User already exists in Supabase Auth. Searching for existing user...');
          const existingUser = await findAuthUserByEmail(adminSupabase, email);
          if (existingUser) {
            authUserId = existingUser.id;
            console.log(`[Create User] Found existing Auth user with ID: ${authUserId}. Updating user credentials...`);
            
            // Update the user's password and metadata
            const { error: updateError } = await adminSupabase.auth.admin.updateUserById(authUserId, {
              password,
              user_metadata: {
                name,
                role,
                phone,
              },
            });
            if (updateError) {
              return NextResponse.json({ error: `User already exists, but updating credentials failed: ${updateError.message}` }, { status: 400 });
            }
          } else {
            return NextResponse.json({ error: `User already exists according to Auth, but could not be located in the user list.` }, { status: 400 });
          }
        } else {
          return NextResponse.json({ error: authError.message }, { status: 400 });
        }
      } else if (authData?.user) {
        authUserId = authData.user.id;
      }

      if (authUserId) {
        // 2. Insert/Upsert user profile into the profiles table (RLS is bypassed via service role key)
        const { error: profileError } = await adminSupabase.from('profiles').upsert({
          id: authUserId,
          email,
          role,
          name,
          phone,
          level: role === 'student' ? 'Intermediate (B1)' : 'Expert',
          needs_password_change: true,
        });

        if (profileError) {
          console.error('[Create User] Profile upsert failed:', profileError.message);
          return NextResponse.json({ error: `Failed to save user profile: ${profileError.message}` }, { status: 400 });
        }

        databaseSaved = true;

        // 3. If student, enroll them in the course
        if (role === 'student' && course) {
          const courseId = course.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          // Check if enrollment already exists to avoid duplicate constraint errors
          const { data: existingEnrollment } = await adminSupabase
            .from('enrollments')
            .select('*')
            .eq('student_id', authUserId)
            .eq('course_id', courseId)
            .maybeSingle();

          if (!existingEnrollment) {
            const { error: enrollError } = await adminSupabase.from('enrollments').insert({
              student_id: authUserId,
              course_id: courseId,
              status: 'active',
            });
            if (enrollError) {
              console.error('[Create User] Enrollment failed:', enrollError.message);
            }
          }
        }
      }
    } else if (supabase) {
      console.log('[Create User] Falling back to standard Supabase Client (Anon Key)...');
      // 1. Sign up the user (sends confirmation email if enabled, logs out admin)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone,
          },
        },
      });

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      if (authData?.user) {
        authUserId = authData.user.id;

        // 2. Insert profile
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authUserId,
          email,
          role,
          name,
          phone,
          level: role === 'student' ? 'Intermediate (B1)' : 'Expert',
          needs_password_change: true,
        });

        if (profileError) {
          console.error('[Create User] Profile insertion failed:', profileError.message);
          return NextResponse.json({
            error: `User was registered in auth, but saving profile failed: ${profileError.message}. To resolve this, configure SUPABASE_SERVICE_ROLE_KEY in .env, or add an INSERT policy to public.profiles in your Supabase dashboard.`
          }, { status: 400 });
        }

        databaseSaved = true;

        // 3. Enroll course
        if (role === 'student' && course) {
          const courseId = course.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const { error: enrollError } = await supabase.from('enrollments').insert({
            student_id: authUserId,
            course_id: courseId,
            status: 'active',
          });
          if (enrollError) {
            console.error('[Create User] Enrollment failed:', enrollError.message);
          }
        }
      }
    } else {
      // Supabase is not configured (Mock / Dev Sandbox mode)
      console.log('Supabase not configured. Simulating mock user database write.');
      databaseSaved = true;
    }

    // 4. Send email using Nodemailer Gmail SMTP
    const origin = request.nextUrl.origin || 'http://localhost:3000';
    const loginUrl = `${origin}/login`;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px 10px; color: #1f2937;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
          <!-- Header -->
          <div style="background-color: #0b3336; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">%APP_NAME_UPPER%</h1>
            <p style="color: #f59e0b; margin: 5px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Your Gateway to Fluency</p>
          </div>
          <!-- Body -->
          <div style="padding: 40px 30px;">
            <h2 style="font-size: 20px; font-weight: 700; color: #0b3336; margin-top: 0;">Welcome, ${name}!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">An administrator has registered your account on the <strong>${appName}</strong> portal. You can now access your dashboard and start learning or managing the portal.</p>
            
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 30px 0;">
              <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Your Credentials</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #4b5563; width: 100px;"><strong>Role:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #111827; text-transform: capitalize;">${role}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #4b5563;"><strong>Email ID:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #111827; font-family: monospace;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #4b5563;"><strong>Password:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0b3336; font-family: monospace; font-weight: bold; letter-spacing: 0.5px;">${password}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 35px 0 20px 0;">
              <a href="${loginUrl}" style="background-color: #0b3336; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(11, 51, 54, 0.2);">Login to Dashboard</a>
            </div>

            <p style="font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center; margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
              For security reasons, we recommend changing your password after your first login.<br>
              If you have any questions, contact us at <a href="mailto:tescavisaconsultancy87@gmail.com" style="color: #067779; text-decoration: none; font-weight: bold;">tescavisaconsultancy87@gmail.com</a>.
            </p>
          </div>
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
            <p style="margin: 0; font-size: 11px; color: #9ca3af;">&copy; 2026 TESCA Spoken English. All rights reserved.</p>
          </div>
        </div>
      </div>
    `.replace('%APP_NAME_UPPER%', appName.toUpperCase());

    let emailSent = false;
    let emailErrorMsg = '';

    const hasGmailConfig = !!process.env.GMAIL_REFRESH_TOKEN;

    if (hasGmailConfig) {
      const emailResult = await sendEmail(
        email,
        `Welcome to ${appName.toUpperCase()} - Your Account Credentials`,
        htmlContent
      );

      if (emailResult.success) {
        console.log(`Credential email successfully sent to ${email} via Gmail REST API`);
        emailSent = true;
      } else {
        console.error('Gmail API send failed:', emailResult.error);
        emailErrorMsg = `Gmail API failed: ${emailResult.error}`;
      }
    } else {
      emailErrorMsg = 'GMAIL_REFRESH_TOKEN is missing in env. Skipping email dispatch.';
    }

    if (!emailSent) {
      return NextResponse.json({
        success: true,
        userId: authUserId,
        password,
        emailSent: false,
        warning: `User created in database, but credentials email failed. Details: ${emailErrorMsg}`
      });
    }

    return NextResponse.json({
      success: true,
      userId: authUserId,
      password,
      emailSent: true,
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: formatFriendlyError(error) },
      { status: 500 }
    );
  }
}
