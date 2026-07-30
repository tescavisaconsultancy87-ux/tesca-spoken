import { sendEmail } from '@/lib/gmail';

const ADMIN_EMAIL = 'tescavisaconsultancy87@gmail.com';

/**
 * Sends a styled HTML alert email to the admin when a critical payment error occurs.
 * This runs server-side only — never import on the client.
 */
export async function sendErrorAlert({
  errorType,
  errorMessage,
  customerEmail,
  customerName,
  customerPhone,
  planId,
  billing,
  paymentId,
  orderId,
  extra,
}: {
  errorType: 'order-creation' | 'payment-verification' | 'enrollment' | 'account-setup' | 'general';
  errorMessage: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  planId?: string;
  billing?: string;
  paymentId?: string;
  orderId?: string;
  extra?: string;
}) {
  try {
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const typeLabels: Record<string, string> = {
      'order-creation': '🛒 Order Creation Failed',
      'payment-verification': '🔐 Payment Verification Failed',
      'enrollment': '📚 Enrollment Failed (Payment Was Successful)',
      'account-setup': '👤 Account Setup Failed (Payment Was Successful)',
      'general': '⚠️ General Checkout Error',
    };

    const subject = `🚨 PAYMENT ALERT: ${typeLabels[errorType] || 'Checkout Error'} — Immediate Action Required`;

    // Sanitize the error message — strip any env vars / secrets / stack traces
    function sanitizeValue(val: string): string {
      return val
        .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[JWT_REDACTED]')
        .replace(/rzp_(test|live)_[A-Za-z0-9]+/g, '[RAZORPAY_KEY_REDACTED]')
        .replace(/[A-Za-z0-9]{20,}/g, (match) => {
          if (/^[A-Za-z0-9+/=_-]{30,}$/.test(match)) return '[SECRET_REDACTED]';
          return match;
        })
        .replace(/at\s+\S+\s*\(.*?\)/g, '[STACK_FRAME_REDACTED]')
        .replace(/Error:\s*/g, '')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .split('\n').slice(0, 3).join('\n');
    }
    const sanitizedError = sanitizeValue(errorMessage);
    const sanitizedExtra = extra ? sanitizeValue(extra) : undefined;

    const detailRows = [
      { label: 'Error Type', value: typeLabels[errorType] || errorType },
      { label: 'Timestamp (IST)', value: timestamp },
      { label: 'Customer Name', value: customerName || 'N/A' },
      { label: 'Customer Email', value: customerEmail || 'N/A' },
      { label: 'Customer Phone', value: customerPhone || 'N/A' },
      { label: 'Plan ID', value: planId || 'N/A' },
      { label: 'Billing', value: billing || 'N/A' },
      { label: 'Razorpay Payment ID', value: paymentId || 'N/A' },
      { label: 'Razorpay Order ID', value: orderId || 'N/A' },
    ].filter(r => r.value !== 'N/A');

    const tableRows = detailRows
      .map(
        (r) =>
          `<tr>
            <td style="padding: 8px 12px; font-size: 13px; color: #4b5563; border-bottom: 1px solid #f3f4f6; font-weight: 600; width: 160px;">${r.label}</td>
            <td style="padding: 8px 12px; font-size: 13px; color: #111827; border-bottom: 1px solid #f3f4f6;">${r.value}</td>
          </tr>`
      )
      .join('');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; background-color: #fef2f2; padding: 40px 10px; color: #1f2937;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fca5a5;">
          <div style="background-color: #dc2626; padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.5px;">🚨 PAYMENT ERROR ALERT</h1>
            <p style="color: #fecaca; margin: 8px 0 0 0; font-size: 12px;">TESCA Spoken English — Automated Alert</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 14px; color: #991b1b; font-weight: bold; margin-top: 0;">
              A critical payment error has occurred and requires your immediate attention.
            </p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              ${tableRows}
            </table>

            <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 10px; padding: 16px; margin: 20px 0;">
              <p style="font-size: 12px; font-weight: bold; color: #991b1b; margin: 0 0 8px 0;">Error Details:</p>
              <pre style="font-size: 12px; color: #7f1d1d; margin: 0; white-space: pre-wrap; word-break: break-word; font-family: monospace; background: #fff5f5; padding: 10px; border-radius: 6px;">${sanitizedError}</pre>
            </div>

            ${sanitizedExtra ? `
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 16px; margin: 20px 0;">
              <p style="font-size: 12px; font-weight: bold; color: #92400e; margin: 0 0 8px 0;">Additional Context:</p>
              <p style="font-size: 12px; color: #78350f; margin: 0;">${sanitizedExtra}</p>
            </div>
            ` : ''}

            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin: 20px 0;">
              <p style="font-size: 12px; font-weight: bold; color: #166534; margin: 0 0 6px 0;">Recommended Actions:</p>
              <ul style="font-size: 12px; color: #15803d; margin: 0; padding-left: 16px; line-height: 1.8;">
                <li>Check the Razorpay Dashboard for payment status</li>
                <li>Verify database connectivity and table integrity</li>
                <li>If payment was captured but enrollment failed, manually enroll the student</li>
                <li>Contact the customer if their payment was deducted but not verified</li>
              </ul>
            </div>

            <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 25px; border-top: 1px solid #f3f4f6; padding-top: 15px;">
              This is an automated alert from TESCA Spoken English payment system.<br>
              Do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;

    await sendEmail(ADMIN_EMAIL, subject, htmlBody);
    console.log(`[Error Alert] Admin alert email sent for: ${errorType}`);
  } catch (alertErr) {
    // Never throw from the alert system — it's a best-effort notification
    console.error('[Error Alert] Failed to send admin alert email:', alertErr);
  }
}
