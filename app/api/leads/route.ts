import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/gmail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, email, phone, topic, message, timeSlot, learningMode } = body;

    // 1. Basic validation
    if (!type || !name || !email) {
      return NextResponse.json(
        { error: 'Lead type, name, and email are required.' },
        { status: 400 }
      );
    }

    if (type === 'demo') {
      if (!phone || !timeSlot || !learningMode) {
        return NextResponse.json(
          { error: 'Phone number, time slot, and learning mode are required for demo bookings.' },
          { status: 400 }
        );
      }
      const cleanedPhone = phone.replace(/\D/g, '');
      if (cleanedPhone.length !== 10) {
        return NextResponse.json(
          { error: 'Phone number must be exactly 10 digits.' },
          { status: 400 }
        );
      }
    } else if (type === 'contact') {
      if (!message) {
        return NextResponse.json(
          { error: 'Message is required for contact submissions.' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid lead type. Must be "contact" or "demo".' },
        { status: 400 }
      );
    }

    // 2. Initialize Supabase Admin Client (Service Role Key required for bypassing RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const adminSupabase = (supabaseUrl && serviceRoleKey)
      ? createClient(supabaseUrl, serviceRoleKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        })
      : null;

    // 3. Format notes and insert lead
    let notes = '';
    if (type === 'contact') {
      notes = `Topic: ${topic || 'General Feedback'}\nMessage: ${message}`;
    } else {
      notes = `Requested Free Demo Class.\nPreferred Time: ${timeSlot}\nLearning Mode: ${learningMode}`;
    }

    const dateAdded = new Date().toLocaleDateString('en-IN', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    const leadId = `lead-${Date.now()}`;
    let databaseSaved = false;

    if (adminSupabase) {
      const { error: dbError } = await adminSupabase.from('leads').insert({
        id: leadId,
        name,
        phone: phone || 'N/A',
        email,
        notes,
        status: 'new',
        date_added: dateAdded
      });

      if (dbError) {
        console.error('[Leads API] Database insertion failed:', dbError.message);
        return NextResponse.json(
          { error: `Database insertion failed: ${dbError.message}` },
          { status: 500 }
        );
      }
      databaseSaved = true;
    } else {
      console.warn('[Leads API] SUPABASE_SERVICE_ROLE_KEY is missing in env. Running in Sandbox Mock Mode.');
      databaseSaved = true; // In mock mode, we simulate database success
    }

    // 4. Send Emails using Gmail REST API
    const appName = process.env.APP_NAME || 'tesca-spoken';
    const emailUser = process.env.EMAIL_USER || 'tescavisaconsultancy87@gmail.com';
    const hasGmailConfig = !!process.env.GMAIL_REFRESH_TOKEN;

    let studentEmailSent = false;
    let adminEmailSent = false;
    let emailErrorMsg = '';

    if (hasGmailConfig) {
      // ── Build Student Confirmation Email HTML ──
      let studentEmailSubject = '';
      let studentEmailHtml = '';

      if (type === 'contact') {
        studentEmailSubject = `We have received your message - ${appName.toUpperCase()}`;
        studentEmailHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px 10px; color: #1f2937;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
              <div style="background-color: #0b3336; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">${appName.toUpperCase()}</h1>
                <p style="color: #f59e0b; margin: 5px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Inquiry Confirmation</p>
              </div>
              <div style="padding: 40px 30px;">
                <h2 style="font-size: 20px; font-weight: 700; color: #0b3336; margin-top: 0;">Hi ${name},</h2>
                <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Thank you for contacting us! We have received your inquiry/feedback and our academic support team will review your message and get back to you within 24 hours.</p>
                
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 30px 0;">
                  <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Your Message Details</p>
                  <p style="margin: 0; font-size: 13px; color: #4b5563;"><strong>Topic:</strong> ${topic || 'General Feedback'}</p>
                  <blockquote style="margin: 10px 0 0 0; padding-left: 12px; border-left: 3px solid #0b3336; font-style: italic; color: #4b5563; font-size: 13px;">
                    ${message}
                  </blockquote>
                </div>

                <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">If you need urgent assistance, feel free to chat with us directly on WhatsApp by clicking the button below.</p>
                <div style="text-align: center; margin: 30px 0 10px 0;">
                  <a href="https://wa.me/919824152731" style="background-color: #25d366; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 8px rgba(37, 211, 102, 0.2);">Chat on WhatsApp</a>
                </div>
              </div>
              <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
                <p style="margin: 0; font-size: 11px; color: #9ca3af;">&copy; 2026 TESCA Spoken English. All rights reserved.</p>
              </div>
            </div>
          </div>
        `;
      } else {
        studentEmailSubject = `Your Free Demo Class Booking Confirmed - ${appName.toUpperCase()}`;
        studentEmailHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px 10px; color: #1f2937;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
              <div style="background-color: #0b3336; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">${appName.toUpperCase()}</h1>
                <p style="color: #f59e0b; margin: 5px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Demo Session Booked</p>
              </div>
              <div style="padding: 40px 30px;">
                <h2 style="font-size: 20px; font-weight: 700; color: #0b3336; margin-top: 0;">Congratulations ${name}!</h2>
                <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">You have successfully booked your <strong>Free Spoken English Demo Class</strong>. You are one step closer to becoming a confident English speaker!</p>
                
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 30px 0;">
                  <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Your Booking Details</p>
                  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <tr>
                      <td style="padding: 6px 0; color: #4b5563; width: 130px;"><strong>Preferred Time Slot:</strong></td>
                      <td style="padding: 6px 0; color: #111827;">${timeSlot}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #4b5563;"><strong>Learning Mode:</strong></td>
                      <td style="padding: 6px 0; color: #111827;">${learningMode}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #4b5563;"><strong>Phone Number:</strong></td>
                      <td style="padding: 6px 0; color: #111827;">${phone}</td>
                    </tr>
                  </table>
                </div>

                <h3 style="font-size: 16px; font-weight: 700; color: #0b3336; margin-top: 25px;">What Happens Next?</h3>
                <ol style="font-size: 13px; color: #4b5563; padding-left: 20px; line-height: 1.6;">
                  <li>An academic counselor will call/WhatsApp you shortly to confirm your slot.</li>
                  <li>We will send you the Zoom meeting details (online mode) or branch location address (offline mode).</li>
                  <li>Attend the 45-minute live demo and receive a free English assessment report!</li>
                </ol>

                <div style="text-align: center; margin: 35px 0 10px 0;">
                  <a href="https://wa.me/919824152731" style="background-color: #25d366; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 8px rgba(37, 211, 102, 0.2);">Connect with Counselor</a>
                </div>
              </div>
              <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
                <p style="margin: 0; font-size: 11px; color: #9ca3af;">&copy; 2026 TESCA Spoken English. All rights reserved.</p>
              </div>
            </div>
          </div>
        `;
      }

      // Send student confirmation email
      const studentResult = await sendEmail(email, studentEmailSubject, studentEmailHtml);
      if (studentResult.success) {
        studentEmailSent = true;
      } else {
        emailErrorMsg += `Student email failed: ${studentResult.error}. `;
      }

      // ── Build Admin Alert Email HTML ──
      const adminEmailSubject = `[NEW LEAD] ${type.toUpperCase()}: ${name}`;
      const adminEmailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 30px 10px; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
            <div style="background-color: #0b3336; padding: 20px 30px; color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
              <h2 style="margin: 0; font-size: 18px; font-weight: bold;">New Website Lead</h2>
              <span style="background-color: #f59e0b; color: #0b3336; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 20px; text-transform: uppercase;">
                ${type === 'demo' ? 'Free Demo Request' : 'Contact form'}
              </span>
            </div>
            
            <div style="padding: 30px;">
              <p style="font-size: 14px; margin-top: 0; color: #4b5563;">A new visitor has submitted their details on the website.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold; width: 140px;">Lead Name:</td>
                  <td style="padding: 10px 0; color: #111827; font-weight: bold;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Email Address:</td>
                  <td style="padding: 10px 0; color: #111827; font-family: monospace;">${email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Phone Number:</td>
                  <td style="padding: 10px 0; color: #111827;">${phone || 'N/A'}</td>
                </tr>
                ${type === 'demo' ? `
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Time Preference:</td>
                    <td style="padding: 10px 0; color: #111827;">${timeSlot}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Learning Mode:</td>
                    <td style="padding: 10px 0; color: #111827;">${learningMode}</td>
                  </tr>
                ` : `
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Inquiry Topic:</td>
                    <td style="padding: 10px 0; color: #111827;">${topic || 'General Feedback'}</td>
                  </tr>
                `}
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold; vertical-align: top;">Date Submitted:</td>
                  <td style="padding: 10px 0; color: #111827;">${dateAdded}</td>
                </tr>
              </table>

              ${type === 'contact' ? `
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0 0 5px 0; font-size: 10px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Message/Inquiry Text</p>
                  <p style="margin: 0; font-size: 13px; color: #374151; white-space: pre-wrap;">${message}</p>
                </div>
              ` : ''}

              <div style="text-align: center; margin-top: 30px;">
                <a href="${request.nextUrl.origin}/admin/leads" style="background-color: #0b3336; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 13px; display: inline-block;">Open Leads Management</a>
              </div>
            </div>
            <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0; font-size: 10px; color: #9ca3af;">Notification generated by ${appName.toUpperCase()} portal.</p>
            </div>
          </div>
        </div>
      `;

      // Send admin notification email
      const adminResult = await sendEmail(emailUser, adminEmailSubject, adminEmailHtml);
      if (adminResult.success) {
        adminEmailSent = true;
      } else {
        emailErrorMsg += `Admin email failed: ${adminResult.error}. `;
      }
    } else {
      emailErrorMsg = 'GMAIL_REFRESH_TOKEN is missing in env. Skipping email dispatch.';
    }

    return NextResponse.json({
      success: true,
      leadId,
      databaseSaved,
      emailsSent: {
        student: studentEmailSent,
        admin: adminEmailSent,
      },
      warning: emailErrorMsg || undefined,
    });

  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during lead processing.' },
      { status: 500 }
    );
  }
}
