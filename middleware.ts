import { NextRequest, NextResponse } from 'next/server';

// Legitimate search engines and AI engines that drive organic and generative discovery (AEO / GEO)
const LEGITIMATE_BOTS = [
  'Googlebot', 'Google', 'Google-Extended', 'GoogleOther', 'Google-Safety', 'Google-InspectionTool', 'Storebot-Google', 'AdsBot-Google', 'Mediapartners-Google',
  'Bingbot', 'BingPreview', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot', 'Seznambot', 'PetalBot', 'Daum',
  // AI Search Engines & Conversational Assistants (Crucial for AEO / citations)
  'OAI-SearchBot', 'GPTBot', 'ChatGPT-User', 'Claude-Web', 'ClaudeBot', 'anthropic-ai',
  'PerplexityBot', 'Perplexity', 'Applebot', 'Applebot-Extended', 'Meta-ExternalAgent', 'Meta-ExternalFetcher',
  'AmazonBot', 'Amazon-SearchBot', 'Amzn-SearchBot', 'cohere-ai', 'YouBot', 'Bytespider', 'CCBot', 'Diffbot',
  // Social media unfurlers & messaging previews
  'facebookexternalhit', 'Twitterbot', 'LinkedInBot', 'WhatsApp', 'TelegramBot', 'Discordbot', 'Pinterestbot', 'Slackbot',
  // SEO Audits & Monitoring (never trap in labyrinth)
  'SemrushBot', 'AhrefsBot',
];

// Vulnerability scanners, headless exploiters, and aggressive automated bots
const MALICIOUS_AND_SCRAPER_BOTS = [
  'jscrawler', 'zgrab', 'censys', 'shodan', 'nmap', 'nikto', 'sqlmap',
  'mj12bot', 'blexbot', 'headlesschrome',
  'phantomjs', 'selenium', 'puppeteer', 'scrapy', 'Go-http-client',
  'python-requests', 'aiohttp', 'httpx', 'curl', 'wget',
  'ImagesiftBot', 'magpie-crawler', 'omgili', 'Omgilibot',
  'peer39_crawler', 'peer39', 'Timpibot',
  'VelenPublicWebCrawler', 'Webzio', 'ZoominfoBot', 'DataForSeoBot', 'Meltwater',
  'Kangaroo Bot', 'AwarioSmartBot', 'AwarioBot', 'Barkrowler',
  'BrightBot', 'DotBot', 'GeckoBot', 'IAScrawler', 'ichiro',
  'Israelsky', 'Laserlikebot', 'Netseercrawler', 'Pcore-HTTP', 'researchscan',
  'SeekrBot', 'seqbot', 'ShopBot', 'Sirdata', 'Screaming Frog', 'ScreenerBot',
  'SiteCheckerBot', 'TrafficBot', 'Trendsmap', 'UptimeRobot', 'VelenCrawler',
  'Wotbox', 'XoviBot', 'ZumBot',
];

const SENSITIVE_PROBE_PATTERNS = [
  '/.env',
  '/.git',
  '/.config',
  '/.aws',
  '/.ssh',
  '/.vscode',
  '/.ds_store',
  '/console',
  '/actuator',
  'admin.php',
  'wp-admin',
  'wp-content',
  'wp-includes',
  'wp-login.php',
  'xmlrpc.php',
  'phpmyadmin',
  'eval-stdin.php',
  'composer.json',
  'package.json',
  'tsconfig.json',
  'web.config',
  '.htaccess',
];

function isSensitiveProbe(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  for (const pattern of SENSITIVE_PROBE_PATTERNS) {
    if (lower.includes(pattern)) return true;
  }
  if (/\.(php|asp|aspx|jsp|env|bak|sql|config|yml|yaml|ini|log)$/i.test(lower)) {
    return true;
  }
  return false;
}

const LABYRINTH_BASE = '/bot-labyrinth';

function isKnownBot(ua: string): 'scraper' | 'legitimate' | null {
  const lower = ua.toLowerCase();
  for (const bot of LEGITIMATE_BOTS) {
    if (lower.includes(bot.toLowerCase())) return 'legitimate';
  }
  for (const bot of MALICIOUS_AND_SCRAPER_BOTS) {
    if (lower.includes(bot.toLowerCase())) return 'scraper';
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware processing for all API endpoints
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const host = request.headers.get('host') || '';
  const hostName = host.split(':')[0].toLowerCase();
  const xProto = request.headers.get('x-forwarded-proto') || '';
  const protocol = xProto || request.nextUrl.protocol.replace(':', '');
  const ua = request.headers.get('user-agent') || '';
  const isLocalhost = hostName.includes('localhost') || hostName.includes('127.0.0.1') || hostName.includes('[::1]');

  // Clean trailing empty question mark
  const cleanSearch = request.nextUrl.search === '?' ? '' : request.nextUrl.search;

  // ─── 301 Permanent Canonical Domain Redirect: tescavisa.com -> tesca.co (ALWAYS, including sitemap/robots) ───
  if (!isLocalhost && (hostName === 'tescavisa.com' || hostName === 'www.tescavisa.com')) {
    return NextResponse.redirect(`https://tesca.co${pathname}${cleanSearch}`, 301);
  }

  // ─── 301 www.tesca.co -> tesca.co for root/standard routes ───
  if (!isLocalhost && hostName === 'www.tesca.co') {
    return NextResponse.redirect(`https://tesca.co${pathname}${cleanSearch}`, 301);
  }

  // Allow standard SEO & system discovery files on canonical domain to bypass checks directly
  const PUBLIC_SYSTEM_FILES = ['/robots.txt', '/sitemap.xml', '/llms.txt', '/llms-full.txt', '/favicon.ico', '/favicon.png', '/manifest.json'];
  if (PUBLIC_SYSTEM_FILES.includes(pathname)) {
    return NextResponse.next();
  }

  // ─── Fast-Drop Aggressive Automated Scrapers & CLI Tools (Prevents 5xx Edge Worker Exhaustion) ───
  const lowerUa = ua.toLowerCase();
  const AGGRESSIVE_CLI_SCRAPERS = [
    'curl/', 'wget/', 'python-requests', 'aiohttp', 'httpx', 'scrapy', 'go-http-client',
    'nikto', 'sqlmap', 'shodan', 'censys', 'zgrab', 'nmap', 'masscan'
  ];
  if (AGGRESSIVE_CLI_SCRAPERS.some((bot) => lowerUa.includes(bot))) {
    return new NextResponse('Access Denied', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'Retry-After': '86400',
      },
    });
  }

  // ─── 0. Early Block for Empty User-Agents & Security Vulnerability Probes ───
  if (!ua.trim()) {
    return NextResponse.json(
      { error: 'Access Denied', message: 'User-Agent header required.' },
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (isSensitiveProbe(pathname)) {
    return NextResponse.json(
      { error: 'Forbidden', message: 'Access to this resource is prohibited.' },
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ─── UNKNOWN SUBDOMAIN → 404 ───
  // Return 404 for any subdomain not in our valid list (admin, tutor, student, www)
  if (!isLocalhost && hostName.endsWith('.tesca.co')) {
    const parts = hostName.split('.');
    if (parts.length > 2) {
      const subdomain = parts[0];
      const validSubdomains = ['admin', 'tutor', 'student', 'www'];
      if (!validSubdomains.includes(subdomain)) {
        return NextResponse.json(
          { error: 'Not Found', message: 'The requested subdomain does not exist.' },
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // ─── 301 Permanent Legacy & WordPress Migration Redirects ───
  // Preserves organic search rankings, backlinks, and eliminates 4xx spikes
  const lowerPath = pathname.toLowerCase();

  if (lowerPath === '/index.php' || lowerPath === '/home.php' || lowerPath === '/default.aspx') {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }
  if (lowerPath === '/dashboard') {
    return NextResponse.redirect(new URL('/login', request.url), 301);
  }
  if (lowerPath === '/courses.php' || lowerPath === '/course.php' || lowerPath.startsWith('/course/')) {
    return NextResponse.redirect(new URL('/courses', request.url), 301);
  }
  if (lowerPath === '/about.php' || lowerPath === '/about-us.php' || lowerPath === '/about-us') {
    return NextResponse.redirect(new URL('/about', request.url), 301);
  }
  if (lowerPath === '/contact.php' || lowerPath === '/contact-us.php' || lowerPath === '/contact-us') {
    return NextResponse.redirect(new URL('/contact', request.url), 301);
  }
  if (lowerPath === '/faq.php') {
    return NextResponse.redirect(new URL('/faq', request.url), 301);
  }
  if (lowerPath === '/privacy-policy' || lowerPath === '/privacy-policy.php' || lowerPath === '/privacy.php') {
    return NextResponse.redirect(new URL('/privacy', request.url), 301);
  }
  if (lowerPath === '/terms-and-conditions' || lowerPath === '/terms.php') {
    return NextResponse.redirect(new URL('/terms', request.url), 301);
  }
  if (lowerPath === '/refund-policy' || lowerPath === '/refund.php') {
    return NextResponse.redirect(new URL('/refund', request.url), 301);
  }
  if (lowerPath === '/demo.php' || lowerPath === '/demo-class' || lowerPath === '/free-demo') {
    return NextResponse.redirect(new URL('/?demo=true', request.url), 301);
  }
  if (lowerPath === '/assessment.php' || lowerPath === '/quiz') {
    return NextResponse.redirect(new URL('/assessment', request.url), 301);
  }
  if (lowerPath.startsWith('/wp-content/uploads/')) {
    return NextResponse.redirect(new URL('/og-image.jpg', request.url), 301);
  }

  // ─── 301 Permanent Redirects for Study Abroad, Visa & Document Pathways ───
  // Rescues ad & social visitors from dead 404s and routes them to personalized counseling
  if (lowerPath === '/germany-opportunity-card' || lowerPath.startsWith('/germany-opportunity-card')) {
    return NextResponse.redirect(new URL('/contact?topic=study-abroad&service=Germany+Opportunity+Card', request.url), 301);
  }
  if (lowerPath === '/uk-graduate-route' || lowerPath.startsWith('/uk-graduate-route')) {
    return NextResponse.redirect(new URL('/contact?topic=study-abroad&service=UK+Graduate+Route', request.url), 301);
  }
  if (lowerPath.startsWith('/document/') || lowerPath === '/document') {
    const docSlug = lowerPath.replace('/document/', '').replace(/\//g, ' ');
    return NextResponse.redirect(new URL(`/contact?topic=study-abroad&service=${encodeURIComponent(docSlug || 'Visa Document Pathway')}`, request.url), 301);
  }
  if (lowerPath.startsWith('/study-abroad/') || lowerPath === '/study-abroad') {
    const countrySlug = lowerPath.replace('/study-abroad/', '').replace(/\//g, ' ');
    return NextResponse.redirect(new URL(`/contact?topic=study-abroad&country=${encodeURIComponent(countrySlug || 'Study Abroad')}`, request.url), 301);
  }
  if (lowerPath === '/study-in-spain' || lowerPath.startsWith('/study-in-spain')) {
    return NextResponse.redirect(new URL('/contact?topic=study-abroad&country=Spain', request.url), 301);
  }
  if (lowerPath === '/eligibility' || lowerPath === '/eligibility-check') {
    return NextResponse.redirect(new URL('/assessment', request.url), 301);
  }

  // ─── Fast-Drop Vulnerability Scanner & Exploit Probes ───
  const EXPLOIT_PROBES = [
    '/wp-admin',
    '/wp-login',
    '/wp-json/',
    '/xmlrpc',
    '/api/auth/signin',
    '/cgi-bin/',
    '/.env',
    '/.git',
    '/.vscode',
    '/_ignition',
    '/userfiles',
    '/phpmyadmin',
    '/actuator/',
    'eval-stdin',
    'setup-config',
    'phpinfo',
  ];
  if (EXPLOIT_PROBES.some((p) => lowerPath.includes(p)) || (lowerPath.endsWith('.php') && lowerPath !== '/index.php')) {
    return new NextResponse(null, { status: 404 });
  }

  // ─── Automated Scraper & Scanner Labyrinth Trap ───
  const uaCheck = isKnownBot(ua);
  if (uaCheck === 'scraper' && !pathname.startsWith(LABYRINTH_BASE)) {
    console.log(`[BOT-FIGHT] Trapped scraper: ${ua.substring(0,80)} -> ${pathname}`);
    const labyrinthUrl = new URL(`${LABYRINTH_BASE}/entry`, request.url);
    labyrinthUrl.searchParams.set('via', btoa(pathname));
    return NextResponse.redirect(labyrinthUrl, 307);
  }

  // Skip middleware for labyrinth pages (they handle themselves)
  if (pathname.startsWith(LABYRINTH_BASE)) {
    return NextResponse.next();
  }

  // 1. Detect subdomain
  let subdomain = '';
  if (hostName.endsWith('tesca.co') || hostName.endsWith('tescavisa.com')) {
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
    // ─── Redirect public marketing routes on subdomains to canonical tesca.co ───
    const PUBLIC_MARKETING_ROUTES = [
      '/about',
      '/courses',
      '/blog',
      '/contact',
      '/faq',
      '/terms',
      '/privacy',
      '/refund',
      '/spoken-english-course',
      '/spoken-english',
      '/review-generator',
      '/assessment',
      '/branches',
    ];
    if (PUBLIC_MARKETING_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
      const targetHost = isLocalhost ? `localhost:${host.split(':')[1] || '3000'}` : 'tesca.co';
      return NextResponse.redirect(`https://${targetHost}${pathname}${cleanSearch}`, 301);
    }

    // If they request '/login', '/maintenance', '/forgot-password', '/reset-password', or '/change-password', let them access the shared pages
    const PUBLIC_AUTH_PATHS = ['/login', '/maintenance', '/forgot-password', '/reset-password', '/change-password'];
    if (PUBLIC_AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
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
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.supabase.co https://static.cloudflareinsights.com https://www.googletagmanager.com https://*.googletagmanager.com https://*.google-analytics.com https://www.google-analytics.com https://*.clarity.ms https://www.clarity.ms https://*.posthog.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
    img-src 'self' data: blob: https://images.pexels.com https://images.unsplash.com https://*.unsplash.com https://*.supabase.co https://*.supabase.in https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms https://c.bing.com https://*.bing.com https://*.posthog.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://api.razorpay.com https://api.indexnow.org https://cdn.jsdelivr.net https://*.cloudflareinsights.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com https://*.bing.com https://*.posthog.com;
    frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://www.youtube.com https://player.vimeo.com https://www.google.com https://www.googletagmanager.com;
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
  matcher: [
    // Match all routes except static files, api routes, and _next internals
    '/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
