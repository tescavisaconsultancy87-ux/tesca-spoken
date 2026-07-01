import { NextRequest, NextResponse } from 'next/server';

// Paths that require an active authenticated session
const PROTECTED_PATHS = ['/admin', '/tutor', '/student'];


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ─── Security Headers (applied to ALL responses) ───
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Detect any Supabase session cookie (cookie names vary by config but start with 'sb-')
  const cookieNames = request.cookies.getAll().map((c) => c.name);
  const hasSessionCookie = cookieNames.some((name) => name.startsWith('sb-'));

  // ─── Dashboard route guard ───
  // Check if this path starts with a protected prefix
  const isProtected = PROTECTED_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (isProtected) {
    // Defense-in-depth: check for Supabase auth cookies.
    // If no session cookies exist, redirect to login immediately.
    // The real auth verification still happens client-side via AuthContext.
    if (!hasSessionCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files, api routes, and _next internals
    '/((?!_next/static|_next/image|favicon\\.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
