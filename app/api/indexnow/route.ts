import { NextRequest, NextResponse } from 'next/server';

const INDEXNOW_KEY = 'd3b07384d113edec49eaa6238ad5ff00';
const HOST = 'tesca.co';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

const PUBLIC_URLS = [
  `https://${HOST}/`,
  `https://${HOST}/about`,
  `https://${HOST}/courses`,
  `https://${HOST}/blog`,
  `https://${HOST}/assessment`,
  `https://${HOST}/contact`,
  `https://${HOST}/faq`,
  `https://${HOST}/privacy`,
  `https://${HOST}/terms`,
  `https://${HOST}/refund`,
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pingAll = searchParams.get('pingAll') === 'true';

  if (!pingAll) {
    return NextResponse.json(
      { error: 'Provide ?pingAll=true to trigger bulk indexing submit' },
      { status: 400 }
    );
  }

  try {
    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: PUBLIC_URLS,
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200 || response.status === 202) {
      return NextResponse.json({
        success: true,
        message: 'Successfully submitted all URLs to IndexNow API',
        status: response.status,
      });
    } else {
      const text = await response.text();
      return NextResponse.json(
        { error: 'IndexNow server rejected submission', status: response.status, details: text },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('[IndexNow Ping Failed]:', err);
    return NextResponse.json(
      { error: 'Internal server error pinging IndexNow API', details: err?.message || err },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urlList } = body;

    if (!urlList || !Array.isArray(urlList) || urlList.length === 0) {
      return NextResponse.json(
        { error: 'Please provide a non-empty array of urlList in body' },
        { status: 400 }
      );
    }

    // Sanitize URLs to ensure they match primary host
    const sanitizedUrls = urlList.map((url: string) => {
      if (url.startsWith('/')) {
        return `https://${HOST}${url}`;
      }
      return url;
    });

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: sanitizedUrls,
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200 || response.status === 202) {
      return NextResponse.json({
        success: true,
        message: `Successfully submitted ${sanitizedUrls.length} URLs to IndexNow API`,
        status: response.status,
      });
    } else {
      const text = await response.text();
      return NextResponse.json(
        { error: 'IndexNow server rejected submission', status: response.status, details: text },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('[IndexNow POST Failed]:', err);
    return NextResponse.json(
      { error: 'Internal server error pinging IndexNow API', details: err?.message || err },
      { status: 500 }
    );
  }
}
