import nodemailer from 'nodemailer';
/**
 * Utility to send emails via Nodemailer (SMTP with App Password) or Gmail REST API.
 * 100% compatible with serverless/edge environments (Cloudflare Workers, Vercel, Node.js).
 */

function getEmailCredentials() {
  let clientId = process.env.GMAIL_CLIENT_ID || '';
  if (clientId.startsWith('https://')) {
    clientId = clientId.replace('https://', '');
  }
  const clientSecret = process.env.GMAIL_CLIENT_SECRET || '';
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN || '';
  const emailUser = process.env.EMAIL_USER || 'tescavisaconsultancy87@gmail.com';
  const appPassword = process.env.APP_PASSWORD || '';

  return { clientId, clientSecret, refreshToken, emailUser, appPassword };
}

/**
 * Gets a fresh access token from Google OAuth2 endpoint using the refresh token.
 */
async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data: any = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to refresh Google access token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

/**
 * Builds a base64url-encoded RFC 2822 MIME message.
 */
function buildMimeEmail(from: string, to: string, subject: string, htmlBody: string): string {
  const emailLines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    htmlBody
  ];
  const email = emailLines.join('\r\n');
  
  const base64 = typeof Buffer !== 'undefined'
    ? Buffer.from(email).toString('base64')
    : btoa(unescape(encodeURIComponent(email)));
    
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends an email using Nodemailer SMTP with App Password, falling back to Gmail REST API.
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { clientId, clientSecret, refreshToken, emailUser, appPassword } = getEmailCredentials();
  const fromHeader = `"TESCA Spoken English" <${emailUser}>`;

  // ─── METHOD 1: NODEMAILER SMTP WITH APP PASSWORD ───
  if (appPassword) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: emailUser,
          pass: appPassword,
        },
      });

      const info = await transporter.sendMail({
        from: fromHeader,
        to,
        subject,
        html: htmlBody,
      });

      console.log('[sendEmail] Successfully sent via Nodemailer SMTP:', info.messageId);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (smtpError: any) {
      console.warn('[sendEmail] Nodemailer SMTP failed, trying Gmail REST API fallback:', smtpError.message || smtpError);
    }
  }

  // ─── METHOD 2: GMAIL OAUTH REST API FALLBACK ───
  try {
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing email credentials (APP_PASSWORD or GMAIL OAuth credentials).');
    }

    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
    const rawEmail = buildMimeEmail(fromHeader, to, subject, htmlBody);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: rawEmail,
      }),
    });

    const result: any = await response.json();
    if (!response.ok) {
      throw new Error(`Gmail API send request failed: ${JSON.stringify(result)}`);
    }

    console.log('[sendEmail] Successfully sent via Gmail REST API:', result.id);
    return {
      success: true,
      messageId: result.id,
    };
  } catch (error: any) {
    console.error('[sendEmail] All email delivery methods failed:', error);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

