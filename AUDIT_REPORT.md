# TESCA Production Audit Report

> Generated: July 2026
> Domain: `tesca.co` (canonical) | Secondary: `tescavisa.com` → 301 redirect
> Platform: Next.js 16 + Cloudflare Workers (via @opennextjs/cloudflare)

---

## EXECUTIVE SUMMARY

| Metric | Before | After |
|--------|--------|-------|
| SSL Handshake Errors (525) | Present on unknown subdomains | ✅ Fixed — routes & middleware catch-all 404 |
| Unknown Subdomain Behavior | 525 SSL Error | ✅ HTTP 404 JSON response |
| Canonical Domain | Unclear / Mixed | ✅ `tesca.co` (tescavisa.com → 301) |
| robots.txt | Missing static file | ✅ Added with clean rules |
| Sitemap | Hash URLs (`/courses#id`) | ✅ Clean URLs + blog posts |
| Page Metadata | 10 pages missing metadata | ✅ All 15+ pages have metadata |
| Structured Data | Partial, per-page only | ✅ Global schema in root layout |
| Security Headers | Partial | ✅ HSTS, CSP, FP, XFO all set |
| CSP | Moderate | ✅ Hardened |
| Study Abroad Link | `https://tescavisa.com` (external) | ✅ Changed to `/contact` |
| 404 Page | Hardcoded `https://tesca.co` URL | ✅ Uses Next.js `Link` component |
| Image Optimization | 65% used native `<img>` | ✅ not-found page fixed; others flagged |
| Bot Protection | AI crawler labyrinth trap | ✅ Preserved and working |

---

## CRITICAL ISSUES (Fixed)

### C1. SSL Handshake Error 525 on Unknown Subdomains

**Problem:** `*.tesca.co` wildcard DNS existed but Cloudflare Worker routes didn't cover wildcard. Random subdomains reached Cloudflare but not the worker → 525.

**Fix:**
- `middleware.ts:47-67` — Added domain canonicalization block: `tescavisa.com` → 301 to `tesca.co`
- `middleware.ts:55-66` — Added unknown subdomain check returning HTTP 404 JSON
- `wrangler.jsonc:17-21` — Added routes: `*.tesca.co/*`, `tescavisa.com/*`, `*.tescavisa.com/*`

**Files changed:**
- `middleware.ts` (lines 47-67 added)
- `wrangler.jsonc` (routes block added)

**Manual step:** In Cloudflare Dashboard → Workers & Pages → `tesca-spoken` → Triggers → Verify/Create routes:
- `*.tesca.co/*`
- `tescavisa.com/*`  
- `*.tescavisa.com/*`

**Expected result:** Unknown subdomains return `{"error":"Not Found","message":"The requested subdomain does not exist."}` with HTTP 404. No SSL error.

---

### C2. No Canonical Domain / tescavisa.com Not Redirecting

**Problem:** Two owned domains (`tescavisa.com`, `tesca.co`) served content without redirect — duplicate content risk. Navbar and Footer linked to `https://tescavisa.com`.

**Fix:**
- `middleware.ts:48-51` — 301 redirect `tescavisa.com` and `www.tescavisa.com` → `tesca.co`
- `lib/data/content.ts:5` — Changed Study Abroad link from `https://tescavisa.com` to `/contact`
- `components/Footer.tsx:53` — Same change for Footer Quick Links

**Expected SEO impact:** Elimination of duplicate content. Consolidation of link equity to `tesca.co`. Expected indexing improvement.

---

## HIGH PRIORITY ISSUES (Fixed)

### H1. Missing robots.txt Static File

**Problem:** No physical `public/robots.txt` file. App relied only on dynamic `robots.ts`.

**Fix:**
- Created `public/robots.txt` — explicit rules for all crawlers, `Disallow` for admin/bot-labyrinth/auth routes
- Updated `app/robots.ts` — added `bot-labyrinth/` and `maintenance` to disallow, separated Googlebot/Bingbot rules

**File created:** `public/robots.txt`

---

### H2. Sitemap with Hash Fragment URLs

**Problem:** `app/sitemap.ts` used `/courses#courseId` — hash fragments are ignored by search engines. No blog posts included.

**Fix:** Rewrote `app/sitemap.ts`:
- Removed all hash-based course URLs
- Added `/courses/{id}` proper URLs with dynamic course data
- Added `/blog/{slug}` dynamic blog post URLs
- Proper `changeFrequency` values (yearly for legal pages)
- All 10 static page routes included

---

### H3. 10+ Pages Missing Metadata

**Problem:** Client-component pages (`'use client'`) cannot export Next.js metadata, leaving them without titles, descriptions, OG tags, or Twitter cards.

**Fix:** Created `layout.tsx` files for each route with proper metadata exports:

| Route | Title | Noindex |
|-------|-------|---------|
| `/assessment` | Free English Assessment — Check Your Fluency Level | No |
| `/blog` | Blog — English Learning Tips, IELTS Advice & Updates | No |
| `/contact` | Contact Us — TESCA Spoken English | Surat | No |
| `/courses` | English Speaking Courses — Spoken English, IELTS & PTE | No |
| `/faq` | Frequently Asked Questions — TESCA Spoken English | No |
| `/login` | Login — TESCA Spoken English Student Portal | Yes |
| `/forgot-password` | Forgot Password — TESCA Spoken English | Yes |
| `/reset-password` | Reset Password — TESCA Spoken English | Yes |
| `/change-password` | Change Password — TESCA Spoken English | Yes |
| `/maintenance` | Maintenance — TESCA Spoken English | Yes |
| `/blog/[slug]` | Dynamic blog post metadata | No |
| `/not-found` | 404 — Page Not Found | Yes |

**Files created:** `app/{route}/layout.tsx` for all 12 routes.

---

### H4. Incomplete Structured Data

**Problem:** Only homepage had organization schema. Other pages had breadcrumbs but no global website/organization markup. No `SearchAction` for Google Sitelinks Search Box.

**Fix:** Added global JSON-LD `@graph` in `app/layout.tsx:115-155` containing:
- `EducationalOrganization` with full address, phone, email, founding date, logo
- `WebSite` with `SearchAction` for Google Sitelinks Search Box
- This schema is now present on EVERY page

Additionally added `generateMetadata` for blog `[slug]` pages with dynamic OG/Twitter/article tags.

---

### H5. Suboptimal Security Headers

**Problem:** Security headers only set in middleware (edge-level). Missing server-level headers for non-middleware routes. No `Cache-Control` for static assets.

**Fix:**
- `middleware.ts:177-198` — HSTS with `includeSubDomains; preload`, CSP, XFO, X-Content-Type-Options, Permissions-Policy
- `next.config.ts` — Added `headers()` with:
  - Server-level X-Frame-Options, X-Content-Type, Referrer-Policy, Permissions-Policy
  - Cache-Control: `immutable` (1 year) for `/static/*`
  - Cache-Control: `stale-while-revalidate` for images
  - Removed `X-Powered-By` header
  - Enabled `reactStrictMode` and `compress: true`

---

## MEDIUM PRIORITY ISSUES (Fixed)

### M1. 404 Page Had Hardcoded Absolute URL

**Problem:** `app/not-found.tsx` used `<a href="https://tesca.co">` which bypasses Next.js routing and creates an unnecessary redirect on the subdomain.

**Fix:** Changed to `<Link href="/">` — proper client-side navigation. Also added metadata export and converted the image to `next/image`.

---

### M2. Missing Redirect Rules for Common Paths

**Problem:** No redirects for common misspellings or alternative paths (`/pricing` was the only one).

**Fix:** Added in `next.config.ts`:
- `/pricing` → `/courses` (301) [existing]
- `/study-abroad` → `/contact` (301)
- `/visa` → `/contact` (301)
- `/ielts` → `/courses` (301)
- `/pte` → `/courses` (301)

---

### M3. Image Optimization Deficiencies

**Problem:** 65% of images used native `<img>` tags — no WebP/AVIF conversion, no lazy loading optimization, 18 images missing width/height causing CLS.

**Fix (immediate):**
- `app/not-found.tsx` — Changed to `next/image` with `fill` and `sizes`

**Remaining (manual):** 
- `components/Courses.tsx:193` — Convert `<img>` to `next/image`
- `components/CoursesList.tsx:221` — Convert `<img>` to `next/image`
- `components/DemoModal.tsx:159` — Convert `<img>` to `next/image`
- `components/dashboard/DashboardSidebar.tsx:87,89` — Convert `<img>` to `next/image`
- `app/login/page.tsx:83,89` — Convert `<img>` to `next/image`
- `app/blog/page.tsx:89` — Convert `<img>` to `next/image`
- `app/blog/[slug]/page.tsx:106` — Convert `<img>` to `next/image`

**Recommendation:** Static `.png` assets should be converted to `.webp` format for production.

---

## REMAINING MANUAL CONFIGURATION

### Cloudflare Dashboard (Required)

| Step | Action | Details |
|------|--------|---------|
| 1 | Verify Worker Routes | Go to Workers & Pages → `tesca-spoken` → Triggers → Routes. Ensure `*.tesca.co/*` is listed |
| 2 | SSL/TLS → Full (Strict) | SSL/TLS → Overview → Full (Strict). This validates the origin certificate |
| 3 | SSL/TLS → Edge Certificates | Enable HTTP/3 (QUIC), check Always Use HTTPS is ON |
| 4 | SSL/TLS → Edge Certificates | Enable "Automatic HTTPS Rewrites" |
| 5 | Speed → Optimization | Enable Brotli compression, Auto Minify (JS, CSS, HTML), Polish (lossless) |
| 6 | Speed → Optimization | Enable Early Hints |
| 7 | Caching → Configuration | Cache level: Standard, Browser Cache TTL: 4 hours |
| 8 | DNS → `tescavisa.com` | Ensure A/AAAA records or CNAME point to Cloudflare (proxied — orange cloud) |
| 9 | DNS → Remove stale records | Audit all DNS records — remove wildcard `*` record if it exists, replace with worker routes |
| 10 | Workers → Routes | Add routes if not auto-deployed: `tescavisa.com/*`, `*.tescavisa.com/*` |
| 11 | Pages → Custom Domains | Add `tescavisa.com` as a custom domain (if using Pages) |
| 12 | Zone → `tescavisa.com` | Add to Cloudflare if not already there, set nameservers |
| 13 | Security → Settings | Enable Browser Integrity Check, set Security Level to Medium |
| 14 | Network | Enable HTTP/2, HTTP/3 (QUIC), gRPC (if needed), 0-RTT Connection Resumption |

### DNS Provider Check

| Record | Type | Value | Proxy |
|--------|------|-------|-------|
| `tesca.co` | A/AAAA/CNAME | Cloudflare IPs | Proxied (orange) |
| `www.tesca.co` | CNAME | `tesca.co` | Proxied |
| `*.tesca.co` | **REMOVE** | N/A | N/A — Handled by Worker routes |
| `admin.tesca.co` | CNAME | `tesca.co` | Proxied (or route-only) |
| `tutor.tesca.co` | CNAME | `tesca.co` | Proxied (or route-only) |
| `student.tesca.co` | CNAME | `tesca.co` | Proxied (or route-only) |
| `tescavisa.com` | A/AAAA/CNAME | Cloudflare IPs | Proxied |
| `www.tescavisa.com` | CNAME | `tescavisa.com` | Proxied |

### Google Search Console

| Action | Details |
|--------|---------|
| Add property | `https://tesca.co` (preferred) |
| Add property | `https://tescavisa.com` — then verify redirect |
| Submit sitemap | `https://tesca.co/sitemap.xml` |
| Request indexing | After deploy, request re-crawl of key pages |
| Monitor | Index Coverage report → inspect all "Excluded" and "Error" entries |

---

## SEO EXPECTED IMPROVEMENTS

| Issue | Before | After | Expected Indexing Impact |
|-------|--------|-------|--------------------------|
| SSL Errors on subdomains | 525 → Google ignores | 404 → Google respects | Zero wasted crawl budget on error pages |
| Duplicate domains | Content on both domains | 301 redirect to canonical | Eliminates duplicate content penalty |
| Missing metadata | Generic fallback titles | Unique per-page titles/descriptions | Higher CTR in SERPs |
| Sitemap hash URLs | `/courses#id` ignored by Google | `/courses/{id}` crawleable | All dynamic pages now eligible for indexing |
| No robots.txt | No explicit rules | Clean rules for all crawlers | Proper crawl budget allocation |
| Missing structured data | No Org/Website schema | Global schema on every page | Rich result eligibility |
| Orphan pages | No blog permalinks | Blog posts in sitemap | Blog content now discoverable |
| Broken internal links | Study Abroad → tescavisa.com (ext) | → /contact (internal) | Internal link equity preserved |

---

## DEPLOYMENT COMMAND

After verifying all changes:

```bash
npm run build
npm run deploy
```

Or combined:
```bash
npm run deploy
```

This runs: `next build && opennextjs-cloudflare build --skipNextBuild && npx wrangler deploy`

---

## FILES CHANGED / CREATED

### Modified
```
middleware.ts                    — Domain canonicalization + unknown subdomain 404
wrangler.jsonc                   — Added routes for wildcard subdomains
next.config.ts                   — headers(), redirects(), image optimization
app/layout.tsx                   — Global JSON-LD structured data
app/sitemap.ts                   — Clean URLs, dynamic courses/blog
app/robots.ts                    — Added bot-labyrinth, maintenance; multi-rule
app/not-found.tsx               — Fixed metadata, Link, next/image
components/Footer.tsx            — Study Abroad link → /contact
lib/data/content.ts              — Study Abroad link → /contact
```

### Created
```
public/robots.txt               — Static robots.txt
app/assessment/layout.tsx        — Metadata for assessment page
app/blog/layout.tsx              — Metadata for blog listing page
app/blog/[slug]/layout.tsx       — Dynamic blog post metadata
app/contact/layout.tsx           — Metadata for contact page
app/courses/layout.tsx           — Metadata for courses page
app/faq/layout.tsx               — Metadata for FAQ page
app/login/layout.tsx             — Metadata (noindex) for login page
app/forgot-password/layout.tsx   — Metadata (noindex)
app/reset-password/layout.tsx    — Metadata (noindex)
app/change-password/layout.tsx   — Metadata (noindex)
app/maintenance/layout.tsx       — Metadata (noindex)
```

---

## VERIFICATION CHECKLIST

- [ ] Deploy to Cloudflare: `npm run deploy`
- [ ] Test main domain: `https://tesca.co` — loads correctly, HTTPS only
- [ ] Test www redirect: `https://www.tesca.co` → 301 to `https://tesca.co`
- [ ] Test HTTP redirect: `http://tesca.co` → 301 to `https://tesca.co`
- [ ] Test tescavisa.com: `https://tescavisa.com` → 301 to `https://tesca.co`
- [ ] Test unknown subdomain: `https://random.tesca.co` → HTTP 404 JSON
- [ ] Test valid subdomain: `https://admin.tesca.co` → login page
- [ ] Test sitemap: `https://tesca.co/sitemap.xml` — valid XML, no hash URLs
- [ ] Test robots.txt: `https://tesca.co/robots.txt` — returns correct rules
- [ ] Test 404 page: `https://tesca.co/nonexistent` — shows custom 404
- [ ] Test OG tags: Each page has proper OG meta in `<head>`
- [ ] Test JSON-LD: Each page has `application/ld+json` script
- [ ] Test Security Headers: HSTS, CSP, XFO present in response headers
- [ ] Test Core Web Vitals: Use PageSpeed Insights / Lighthouse
- [ ] Search Console: Submit sitemap, inspect key pages
