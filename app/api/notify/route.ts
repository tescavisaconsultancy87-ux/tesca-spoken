import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/gmail';
import { verifyAuthAndRole } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // 1. Guard check: only tutor or admin can send notifications
    const auth = await verifyAuthAndRole(request, ['tutor', 'admin']);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Access denied.' },
        { status: auth.status || 401 }
      );
    }

    const body = await request.json();
    const { type, details } = body;

    if (!type || !details) {
      return NextResponse.json({ error: 'Missing type or details parameter.' }, { status: 400 });
    }

    // 2. Initialize admin Supabase client using service role key
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase configuration is missing on the server.' }, { status: 500 });
    }

    const adminSupabase = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 3. Fetch active students (filter by batch if batch_id is provided)
    let targetStudentIds: string[] | null = null;
    let isBatchQuery = false;

    if (details && details.batch_id) {
      isBatchQuery = true;
      const { data: batch, error: batchError } = await adminSupabase
        .from('batches')
        .select('student_ids')
        .eq('id', details.batch_id)
        .maybeSingle();

      if (!batchError && batch) {
        targetStudentIds = Array.isArray(batch.student_ids)
          ? batch.student_ids
          : typeof batch.student_ids === 'string'
          ? JSON.parse(batch.student_ids)
          : [];
      }
    }

    let students: any[] = [];
    let studentsError: any = null;

    if (isBatchQuery) {
      if (targetStudentIds && targetStudentIds.length > 0) {
        const { data, error } = await adminSupabase
          .from('profiles')
          .select('id, email, name')
          .eq('role', 'student')
          .in('id', targetStudentIds);
        students = data || [];
        studentsError = error;
      } else {
        students = [];
      }
    } else {
      const { data, error } = await adminSupabase
        .from('profiles')
        .select('id, email, name')
        .eq('role', 'student');
      students = data || [];
      studentsError = error;
    }

    if (studentsError) {
      console.error('[Notify API] Failed to fetch student profiles:', studentsError.message);
      return NextResponse.json({ error: 'Failed to fetch student profiles from database.' }, { status: 500 });
    }

    if (!students || students.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: 'No student profiles found to notify.' });
    }

    console.log(`[Notify API] Triggering notifications for ${students.length} students. Type: ${type}`);

    // 4. Construct notification subject, text, and email template based on type
    let emailSubject = '';
    let notificationText = '';
    let emailHtml = '';

    const appName = process.env.APP_NAME || 'tesca-spoken';
    const appNameUpper = appName.toUpperCase();
    const origin = request.nextUrl.origin || 'http://localhost:3000';

    if (type === 'live-class-create') {
      const { topic, trainer, dateTime, duration, joinUrl } = details;
      emailSubject = `New Live Class Scheduled: "${topic}"`;
      notificationText = `New Live Class Scheduled: "${topic}" by ${trainer} on ${dateTime}.`;
      
      const linkHtml = joinUrl 
        ? `<div style="text-align: center; margin: 35px 0 20px 0;">
             <a href="${joinUrl}" style="background-color: #0b3336; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">Join Live Session</a>
           </div>`
        : `<p style="font-size: 14px; color: #6b7280; font-style: italic; text-align: center;">Join link will be shared shortly before class starts.</p>`;

      emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 40px 10px; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background-color: #0b3336; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${appNameUpper} LIVE CLASS</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #0b3336; margin-top: 0;">New Live Session Scheduled</h2>
              <p>Hi Student,</p>
              <p>A new live interactive English class has been scheduled. Here are the details:</p>
              
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563; width: 120px;"><strong>Topic:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #111827;"><strong>${topic}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563;"><strong>Trainer:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #111827;">${trainer}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563;"><strong>Date & Time:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #111827;">${dateTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563;"><strong>Duration:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #111827;">${duration}</td>
                  </tr>
                </table>
              </div>
              
              ${linkHtml}
              
              <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                You can also view this class schedule and join directly from your dashboard.<br>
                Need help? Email us at <a href="mailto:tescavisaconsultancy87@gmail.com" style="color: #067779; text-decoration: none;">tescavisaconsultancy87@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      `;
    } 
    else if (type === 'live-class-update') {
      const { topic, trainer, dateTime, duration, joinUrl } = details;
      emailSubject = `Rescheduled Live Class: "${topic}"`;
      notificationText = `Live Class Rescheduled: "${topic}" is now at ${dateTime}.`;
      
      const linkHtml = joinUrl 
        ? `<div style="text-align: center; margin: 35px 0 20px 0;">
             <a href="${joinUrl}" style="background-color: #0b3336; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">Join Live Session</a>
           </div>`
        : `<p style="font-size: 14px; color: #6b7280; font-style: italic; text-align: center;">Join link will be shared shortly before class starts.</p>`;

      emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 40px 10px; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background-color: #f59e0b; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">CLASS RESCHEDULED</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #b45309; margin-top: 0;">Schedule Update</h2>
              <p>Hi Student,</p>
              <p>Please note that the schedule for your live class has been updated. Here is the new class timing:</p>
              
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563; width: 120px;"><strong>Topic:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #111827;"><strong>${topic}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563;"><strong>Trainer:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #111827;">${trainer}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563;"><strong>New Time:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #b45309; font-weight: bold;">${dateTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563;"><strong>Duration:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #111827;">${duration}</td>
                  </tr>
                </table>
              </div>
              
              ${linkHtml}
              
              <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                You can review this schedule update on your dashboard.<br>
                For questions, contact <a href="mailto:tescavisaconsultancy87@gmail.com" style="color: #067779; text-decoration: none;">tescavisaconsultancy87@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      `;
    } 
    else if (type === 'live-class-delete') {
      const { topic, trainer } = details;
      emailSubject = `CANCELLED: Live Class - "${topic}"`;
      notificationText = `Cancelled: Live Class "${topic}" has been cancelled.`;

      emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 40px 10px; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background-color: #dc2626; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">CLASS CANCELLED</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #b91c1c; margin-top: 0;">Cancellation Notice</h2>
              <p>Hi Student,</p>
              <p>We regret to inform you that the following scheduled live class has been cancelled:</p>
              
              <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #7f1d1d; width: 120px;"><strong>Class Topic:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #7f1d1d;"><strong>${topic}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #7f1d1d;"><strong>Trainer:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #7f1d1d;">${trainer}</td>
                  </tr>
                </table>
              </div>
              
              <p>We apologize for the inconvenience caused. If the class is rescheduled, you will receive another update shortly.</p>
              
              <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                For any queries, please email us at <a href="mailto:tescavisaconsultancy87@gmail.com" style="color: #067779; text-decoration: none;">tescavisaconsultancy87@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      `;
    } 
    else if (type === 'material-create') {
      const { name, category, format, size, downloadUrl } = details;
      emailSubject = `New Study Resource Available: "${name}"`;
      notificationText = `New Study Resource: "${name}" (${format}) has been uploaded.`;

      emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 40px 10px; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background-color: #0b3336; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${appNameUpper} STUDY MATERIAL</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #0b3336; margin-top: 0;">New Material Uploaded</h2>
              <p>Hi Student,</p>
              <p>A new learning resource has been added for your studies. You can view or download it using the details below:</p>
              
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563; width: 120px;"><strong>Resource:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #111827;"><strong>${name}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563;"><strong>Category:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #111827; text-transform: capitalize;">${category}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563;"><strong>Format:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #111827;">${format}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #4b5563;"><strong>File Size:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #111827;">${size}</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin: 35px 0 20px 0;">
                <a href="${origin}/student/materials" style="background-color: #0b3336; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">Access Study Materials</a>
              </div>
              
              <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                You can download the resource from the Study Materials tab in your dashboard.<br>
                For questions, contact <a href="mailto:tescavisaconsultancy87@gmail.com" style="color: #067779; text-decoration: none;">tescavisaconsultancy87@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      `;
    }

    // 5. Send in-app notifications and email alerts in parallel
    const emailPromises = students.map(student => {
      // Clean up names if default names exist
      const personalHtml = emailHtml.replace('Hi Student,', `Hi ${student.name || 'Student'},`);
      return sendEmail(student.email, emailSubject, personalHtml);
    });

    // Try to save to DB notifications table in parallel (wrapped in try/catch to avoid failure if table is missing)
    try {
      const dbNotificationInserts = students.map(student => {
        return adminSupabase.from('notifications').insert({
          user_id: student.id,
          text: notificationText,
          type: type,
          unread: true
        });
      });
      await Promise.allSettled(dbNotificationInserts);
    } catch (dbErr) {
      console.warn('[Notify API] In-app database notifications write failed (probably because the table public.notifications has not been created yet). Falling back to emails-only.', dbErr);
    }

    // Wait for all emails to complete
    const emailResults = await Promise.allSettled(emailPromises);
    const successCount = emailResults.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;

    console.log(`[Notify API] Successfully sent emails to ${successCount}/${students.length} students.`);

    return NextResponse.json({
      success: true,
      studentsCount: students.length,
      emailsSent: successCount,
      notificationText
    });
  } catch (err: any) {
    console.error('[Notify API] Internal Error:', err);
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 }
    );
  }
}
