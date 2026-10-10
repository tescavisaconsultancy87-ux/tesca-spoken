import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

// Rate Limiting: 12 requests per 10 minutes per IP
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 12;
const ipRequestHistory = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(ip) || [];
  const recent = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, recent);
    return true;
  }

  recent.push(now);
  ipRequestHistory.set(ip, recent);

  if (ipRequestHistory.size > 2000) {
    for (const [key, times] of ipRequestHistory.entries()) {
      const active = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        ipRequestHistory.delete(key);
      } else {
        ipRequestHistory.set(key, active);
      }
    }
  }

  return false;
}

function sanitize(str: unknown, maxLen = 50): string {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .substring(0, maxLen)
    .replace(/[^a-zA-Z0-9\s\-\.]/g, '');
}

// Spoken English authentic ~30-word human fallback templates with branch support
function getFallbackReview(course = '', highlight = '', branch = 'Sarthana'): string {
  const branchName = branch && branch.toLowerCase() !== 'all' ? `${branch} branch` : 'Surat campus';
  const templates = [
    `Joined TESCA Spoken English at the ${branchName} and my speaking confidence improved drastically. The trainers are patient, friendly, and focus on practical conversation rather than boring grammar rules. Best spoken English classes in Surat!`,
    `Had an incredible learning experience at TESCA ${branchName}. The interactive group discussions and personal speaking practice helped me overcome my stage fear and hesitate less in daily English communication.`,
    `Highly recommend TESCA ${branchName} for spoken English! The faculty explains concepts simply and encourages everyone to speak without hesitation. My fluency and vocabulary improved noticeably in just a few weeks.`,
    `TESCA is hands down the best English speaking institute in Surat. Friendly trainers at the ${branchName}, supportive batchmates, and daily speaking activities made learning enjoyable and completely natural. 5-star coaching!`,
    `Enrolled at TESCA ${branchName} to improve my spoken English for job interviews. The personal attention, mock interviews, and confidence-building sessions were fantastic. Grateful to the entire TESCA team!`,
    `Outstanding coaching at TESCA ${branchName}! The atmosphere is very positive and motivating. The trainers make sure every student gets ample speaking time during class. Highly satisfied with my progress.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

export async function POST(req: Request) {
  try {
    // 1. Boundary Guard: Reject payloads > 8KB
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 8192) {
      return NextResponse.json(
        { error: 'Payload too large', review: getFallbackReview() },
        { status: 413 }
      );
    }

    // 2. IP Rate Limiting (12 requests / 10 minutes)
    const ip =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const isLimited = isRateLimited(ip);
    if (isLimited) {
      return NextResponse.json(
        { review: getFallbackReview(), source: 'rate_limit_fallback' },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // 3. Parse and sanitize input
    const body = await req.json().catch(() => ({}));
    const branch = sanitize(body.branch, 40) || 'Sarthana';
    const course = sanitize(body.course || body.category, 50);
    const highlight = sanitize(body.highlight || body.service, 50);

    // 4. If Groq API key is not present, use graceful fallback templates instantly
    if (!GROQ_API_KEY) {
      const fallback = getFallbackReview(course, highlight, branch);
      return NextResponse.json(
        { review: fallback, source: 'fallback' },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // 5. Groq LPU Llama 3.3 70B Generation
    const systemPrompt = `You are a real student writing an authentic, positive 5-star Google Review for "TESCA Spoken English Institute (${branch} Branch)" in Surat, Gujarat.
Strict Requirements:
- Length: approximately 30 words (25 to 35 words).
- Focus on practical spoken English, stage fear / hesitation removal, friendly patient trainers, and confidence.
- Sound like a real student from Surat, warm, natural, and grateful. Avoid robotic marketing buzzwords.
- Output ONLY the raw review text in English. Do not include quotes, titles, or notes.`;

    const userCourse = course && course.toLowerCase() !== 'all' ? course : 'Spoken English & Fluency';
    const userHighlight = highlight && highlight.toLowerCase() !== 'all' ? highlight : 'Confidence & Hesitation Removal';

    const userPrompt = `Write an authentic 5-star Google review for TESCA Spoken English (${branch} Branch Surat).
Course: ${userCourse}
Highlight: ${userHighlight}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.85,
          max_tokens: 150,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Groq API returned status ${res.status}`);
      }

      const data = await res.json();
      let rawReview = data.choices?.[0]?.message?.content?.trim() || '';
      rawReview = rawReview.replace(/^["'`]+|["'`]+$/g, '').trim();

      const finalReview = rawReview || getFallbackReview(course, highlight, branch);

      return NextResponse.json(
        { review: finalReview, source: 'ai' },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    } catch {
      clearTimeout(timeout);
      return NextResponse.json(
        { review: getFallbackReview(course, highlight, branch), source: 'fallback_error' },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }
  } catch {
    return NextResponse.json(
      { review: getFallbackReview(), source: 'fallback_generic' },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
