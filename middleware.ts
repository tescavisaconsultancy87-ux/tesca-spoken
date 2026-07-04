import { NextRequest, NextResponse } from 'next/server';

// Paths that require an active authenticated session
const PROTECTED_PATHS = ['/admin', '/tutor', '/student'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const xProto = request.headers.get('x-forwarded-proto') || '';
  const protocol = xProto || request.nextUrl.protocol.replace(':', '');

  // ─── 301 Permanent Domain Redirects (Production Only) ───
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('[::1]');
  if (!isLocalhost && (host.startsWith('www.') || protocol === 'http')) {
    const cleanHost = host.replace(/^www\./, '') || 'tesca.co';
    const targetUrl = `https://${cleanHost}${pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(targetUrl, 301);
  }

  // ─── Protected Path Guard ───
  const cookieNames = request.cookies.getAll().map((c) => c.name);
  const hasSessionCookie = cookieNames.some((name) => name.startsWith('sb-'));

  const isProtected = PROTECTED_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (isProtected) {
    if (!hasSessionCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // ─── Security Headers (applied to ALL responses) ───
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.supabase.co;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
    img-src 'self' data: blob: https://images.pexels.com https://*.supabase.co https://*.supabase.in;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://api.razorpay.com https://api.indexnow.org;
    frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://www.youtube.com https://player.vimeo.com https://www.google.com;
    media-src 'self' blob: https://*.supabase.co;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  runtime: 'experimental-edge',
  matcher: [
    // Match all routes except static files, api routes, and _next internals
    '/((?!_next/static|_next/image|favicon\\.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
