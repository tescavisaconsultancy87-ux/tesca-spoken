import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const hostName = host.split(':')[0].toLowerCase();
  const xProto = request.headers.get('x-forwarded-proto') || '';
  const protocol = xProto || request.nextUrl.protocol.replace(':', '');

  // 1. Detect subdomain
  let subdomain = '';
  if (hostName.endsWith('tesca.co')) {
    const parts = hostName.split('.');
    if (parts.length > 2) {
      subdomain = parts[0];
    }
  } else if (hostName.endsWith('localhost')) {
    const parts = hostName.split('.');
    if (parts.length > 1) {
      subdomain = parts[0];
    }
  }

  const isSubdomain = ['admin', 'tutor', 'student'].includes(subdomain);
  const isRewritten = request.nextUrl.searchParams.get('_rewritten') === 'true';

  // ─── 301 Permanent Domain Redirects (Production Only) ───
  const isLocalhost = hostName.includes('localhost') || hostName.includes('127.0.0.1') || hostName.includes('[::1]');
  if (!isLocalhost && !isSubdomain && (hostName.startsWith('www.') || protocol === 'http')) {
    const cleanHost = hostName.replace(/^www\./, '') || 'tesca.co';
    const targetUrl = `https://${cleanHost}${pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(targetUrl, 301);
  }

  // ─── Subdomain / Role Path Mapping & Redirection ───
  // Skip if we are processing an internal rewrite to avoid infinite loops
  if (!isRewritten) {
    const rolePrefixes = ['/admin', '/tutor', '/student'];
    const matchedRole = rolePrefixes.find(prefix => pathname === prefix || pathname.startsWith(prefix + '/'));

    if (matchedRole) {
      const targetRole = matchedRole.slice(1); // 'admin' | 'tutor' | 'student'
      
      // If we are already on the correct subdomain, redirect to the clean path (e.g. admin.tesca.co/admin/students -> admin.tesca.co/students)
      if (subdomain === targetRole) {
        const remainingPath = pathname.substring(matchedRole.length) || '/';
        const redirectUrl = new URL(remainingPath, request.url);
        return NextResponse.redirect(redirectUrl);
      } else {
        // Redirect to the correct subdomain
        const remainingPath = pathname.substring(matchedRole.length) || '/';
        const targetHost = isLocalhost 
          ? `${targetRole}.localhost:${host.split(':')[1] || '3000'}` 
          : `${targetRole}.tesca.co`;
        return NextResponse.redirect(`${protocol}://${targetHost}${remainingPath}${request.nextUrl.search}`);
      }
    }
  }

  // ─── Protected Path Guard & Rewriting ───
  const cookieNames = request.cookies.getAll().map((c) => c.name);
  const hasSessionCookie = cookieNames.some(
    (name) => name.startsWith('sb-') || name === 'sb-mock-session'
  );

  if (isSubdomain && !isRewritten) {
    // If they request '/login' or '/maintenance', let them access the shared pages
    if (pathname === '/login' || pathname === '/maintenance') {
      return NextResponse.next();
    }

    // If they are not logged in, redirect to the subdomain's login page
    if (!hasSessionCookie) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If logged in, internally rewrite the request to the subfolder path
    // e.g. admin.tesca.co/students -> /admin/students?_rewritten=true
    const targetUrl = new URL(`/${subdomain}${pathname}`, request.url);
    targetUrl.searchParams.set('_rewritten', 'true');
    return NextResponse.rewrite(targetUrl);
  }

  // Fallback for paths on the main domain that are protected but not rewritten
  if (!isSubdomain && !isRewritten) {
    const PROTECTED_PATHS = ['/admin', '/tutor', '/student'];
    const isProtected = PROTECTED_PATHS.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
    );

    if (isProtected && !hasSessionCookie) {
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
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.supabase.co https://static.cloudflareinsights.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
    img-src 'self' data: blob: https://images.pexels.com https://*.supabase.co https://*.supabase.in;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://api.razorpay.com https://api.indexnow.org https://cdn.jsdelivr.net https://*.cloudflareinsights.com;
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
