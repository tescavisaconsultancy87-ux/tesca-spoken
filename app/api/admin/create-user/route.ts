import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabaseClient';

// Helper to generate a random password (minimum 8 characters)
function generateRandomPassword(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
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

    const password = generateRandomPassword(8);
    const appName = process.env.APP_NAME || 'tesca-spoken';
    const emailUser = process.env.EMAIL_USER || 'tescavisaconsultancy87@gmail.com';
    const emailPass = process.env.APP_PASSWORD || '';

    let databaseSaved = false;
    let authUserId = `mock-id-${Date.now()}`;

    // If Supabase is configured, create the user
    if (supabase) {
      // 1. Sign up the user in Supabase auth (creates user in auth.users)
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

        // 2. Insert user profile into the profiles table
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authUserId,
          email,
          role,
          name,
          phone,
          level: role === 'student' ? 'Intermediate (B1)' : 'Expert',
        });

        if (profileError) {
          // If profile table insert fails, log but continue (or we can return error)
          console.error('Failed to create profile record:', profileError.message);
        } else {
          databaseSaved = true;
        }

        // 3. If student, we can optionally enroll them in the course
        if (role === 'student' && course) {
          // Find or match course ID
          const courseId = course.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const { error: enrollError } = await supabase.from('enrollments').insert({
            student_id: authUserId,
            course_id: courseId,
            status: 'active',
          });
          if (enrollError) {
            console.error('Failed to create enrollment:', enrollError.message);
          }
        }
      }
    } else {
      // Supabase is not configured (Mock / Dev Sandbox mode)
      console.log('Supabase not configured. Simulating mock user database write.');
      databaseSaved = true;
    }

    // 4. Send email using Nodemailer
    if (emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        const origin = request.nextUrl.origin || 'http://localhost:3000';
        const loginUrl = `${origin}/login`;

        const htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px 10px; color: #1f2937;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
              <!-- Header -->
              <div style="background-color: #0b3336; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">TESCA SPOKEN ENGLISH</h1>
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
        `;

        await transporter.sendMail({
          from: `"${appName.toUpperCase()}" <${emailUser}>`,
          to: email,
          subject: `Welcome to ${appName.toUpperCase()} - Your Account Credentials`,
          html: htmlContent,
        });

        console.log(`Credential email successfully sent to ${email}`);
      } catch (mailError) {
        console.error('Nodemailer failed to send email:', mailError);
        // We still return 200/success since the user was created in DB, but alert about email failure
        return NextResponse.json({
          success: true,
          userId: authUserId,
          password,
          emailSent: false,
          warning: 'User created in database, but credentials email failed to send.'
        });
      }
    } else {
      console.warn('APP_PASSWORD is missing in env. Skipping email dispatch.');
    }

    return NextResponse.json({
      success: true,
      userId: authUserId,
      password,
      emailSent: !!emailPass,
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during user creation.' },
      { status: 500 }
    );
  }
}
