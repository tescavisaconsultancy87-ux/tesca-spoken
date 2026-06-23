/**
 * Gmail REST API utility to send emails.
 * This is compatible with serverless environments (Cloudflare Workers, Vercel, etc.)
 * as it uses standard fetch requests rather than TCP-based SMTP (Nodemailer).
 */

// Helper to get raw GMAIL API tokens from environment
function getGmailCredentials() {
  let clientId = process.env.GMAIL_CLIENT_ID || '';
  if (clientId.startsWith('https://')) {
    clientId = clientId.replace('https://', '');
  }
  const clientSecret = process.env.GMAIL_CLIENT_SECRET || '';
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN || '';
  const emailUser = process.env.EMAIL_USER || 'tescavisaconsultancy87@gmail.com';

  return { clientId, clientSecret, refreshToken, emailUser };
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
  
  // Base64url encode the string
  const base64 = typeof Buffer !== 'undefined'
    ? Buffer.from(email).toString('base64')
    : btoa(unescape(encodeURIComponent(email))); // Browser/worker fallback
    
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends an email using the Gmail REST API.
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { clientId, clientSecret, refreshToken, emailUser } = getGmailCredentials();

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, or GMAIL_REFRESH_TOKEN in environment variables.');
    }

    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

    const fromHeader = `"TESCA Spoken English" <${emailUser}>`;
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

    return {
      success: true,
      messageId: result.id,
    };
  } catch (error: any) {
    console.error('Gmail API Send Email Error:', error);
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}
