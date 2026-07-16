const BASE_URL = 'https://tesca.co';
const MAX_PAGES = 80;
const TIMEOUT_MS = 20000;

const results = {
  scanned: 0,
  broken: [],
  serverErrors: [],
  titles: { missing: [], short: [], long: [], duplicates: [] },
  descriptions: { missing: [], short: [], long: [], duplicates: [] },
  multipleH1: [],
  noH1: [],
  noCanonical: [],
  noOg: [],
  thinContent: [],
  redirected: [],
  allTitles: {},
  allDescriptions: {},
  sourceMap: {},
};

async function fetchWithTimeout(url, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'manual' });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function fetchSitemap() {
  const urls = [];
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/sitemap.xml`);
    if (!res.ok) { console.log(`Sitemap returned ${res.status}, skipping`); return urls; }
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
    for (const m of locs) urls.push(m[1].trim());
  } catch (e) {
    console.log('Sitemap fetch failed:', e.message);
  }
  return [...new Set(urls)];
}

function extractMeta(html, tag, attr = 'name', attrVal) {
  const patterns = [
    new RegExp(`<${tag}[^>]*${attr}="${attrVal}"[^>]*content="([^"]*)"`, 'i'),
    new RegExp(`<${tag}[^>]*content="([^"]*)"[^>]*${attr}="${attrVal}"`, 'i'),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1];
  }
  return null;
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : null;
}

function extractH1s(html) {
  const h1s = [];
  const re = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    h1s.push(match[1].replace(/<[^>]*>/g, '').trim());
  }
  return h1s;
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i);
  return m ? m[1] : null;
}

function extractInternalLinks(html, baseUrl) {
  const links = [];
  const re = /<a[^>]*href="([^"]*)"/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    let href = match[1].split('#')[0].split('?')[0];
    if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('#') || href.startsWith('/cdn-cgi/')) continue;
    try {
      const resolved = new URL(href, baseUrl).href;
      if (resolved.startsWith(BASE_URL) && !resolved.includes('/api/') && !resolved.includes('/admin/') && !resolved.includes('/student/') && !resolved.includes('/tutor/') && !resolved.includes('/cdn-cgi/')) {
        links.push(resolved);
      }
    } catch {}
  }
  return [...new Set(links)];
}

function extractNextData(html) {
  // Extract page metadata from Next.js RSC payload
  const title = extractTitle(html);
  const desc = extractMeta(html, 'meta', 'name', 'description');
  const ogTitle = extractMeta(html, 'meta', 'property', 'og:title');
  const ogDesc = extractMeta(html, 'meta', 'property', 'og:description');
  const h1s = extractH1s(html);
  const canonical = extractCanonical(html);
  return { title, desc, ogTitle, ogDesc, h1s, canonical };
}

async function crawlUrl(url, depth = 0) {
  if (depth > 3 || results.scanned >= MAX_PAGES) return;
  const normalized = url.replace(/\/$/, '');
  if (results.allTitles[normalized] !== undefined) return;

  results.scanned++;
  process.stdout.write(`  [${results.scanned}/${MAX_PAGES}] ${normalized} ... `);

  let res;
  try {
    res = await fetchWithTimeout(normalized);
  } catch (e) {
    process.stdout.write(`❌ ${e.message}\n`);
    results.broken.push({ url: normalized, error: e.message });
    return;
  }

  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get('location') || 'unknown';
    process.stdout.write(`-> ${res.status} → ${location}\n`);
    results.redirected.push({ url: normalized, to: location, status: res.status });
    const resolved = new URL(location, normalized).href;
    if (resolved.startsWith(BASE_URL)) await crawlUrl(resolved, depth + 1);
    return;
  }

  if (res.status === 404) {
    process.stdout.write(`404\n`);
    results.broken.push({ url: normalized, status: 404 });
    return;
  }

  if (res.status >= 500) {
    process.stdout.write(`${res.status}\n`);
    results.serverErrors.push({ url: normalized, status: res.status });
    return;
  }

  if (!res.ok) {
    process.stdout.write(`${res.status}\n`);
    results.broken.push({ url: normalized, status: res.status });
    return;
  }

  process.stdout.write(`${res.status}\n`);

  const html = await res.text();
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) return;

  const { title, desc, ogTitle, ogDesc, h1s, canonical } = extractNextData(html);

  results.allTitles[normalized] = title;
  results.allDescriptions[normalized] = desc;

  if (!title) results.titles.missing.push(normalized);
  else if (title.length < 30) results.titles.short.push({ url: normalized, title, length: title.length });
  else if (title.length > 60) results.titles.long.push({ url: normalized, title, length: title.length });

  if (!desc) results.descriptions.missing.push(normalized);
  else if (desc.length < 50) results.descriptions.short.push({ url: normalized, desc, length: desc.length });
  else if (desc.length > 160) results.descriptions.long.push({ url: normalized, desc, length: desc.length });

  if (h1s.length === 0) results.noH1.push(normalized);
  else if (h1s.length > 1) results.multipleH1.push({ url: normalized, h1s });

  if (!canonical) results.noCanonical.push(normalized);
  if (!ogTitle || !ogDesc) results.noOg.push(normalized);

  if (html.length < 500) results.thinContent.push(normalized);

  const internalLinks = extractInternalLinks(html, normalized);
  for (const link of internalLinks) {
    const norm = link.replace(/\/$/, '');
    if (results.allTitles[norm] === undefined) {
      if (!results.sourceMap[norm]) results.sourceMap[norm] = [];
      if (!results.sourceMap[norm].includes(normalized)) results.sourceMap[norm].push(normalized);
      await crawlUrl(link, depth + 1);
    }
  }
}

function findDuplicates() {
  const titleMap = {};
  for (const [url, title] of Object.entries(results.allTitles)) {
    if (!title) continue;
    if (!titleMap[title]) titleMap[title] = [];
    titleMap[title].push(url);
  }
  for (const [title, urls] of Object.entries(titleMap)) {
    if (urls.length > 1) results.titles.duplicates.push({ title, urls, count: urls.length });
  }

  const descMap = {};
  for (const [url, desc] of Object.entries(results.allDescriptions)) {
    if (!desc) continue;
    if (!descMap[desc]) descMap[desc] = [];
    descMap[desc].push(url);
  }
  for (const [desc, urls] of Object.entries(descMap)) {
    if (urls.length > 1) results.descriptions.duplicates.push({ desc, urls, count: urls.length });
  }
}

async function generateReport() {
  findDuplicates();
  const report = [];
  const w = (s) => report.push(s);

  w('='.repeat(80));
  w('  TESCA.CO — SEO CRAWL REPORT');
  w(`  Generated: ${new Date().toISOString()}`);
  w(`  Base URL: ${BASE_URL}`);
  w('='.repeat(80));
  w('');

  w(`Total pages scanned: ${results.scanned}`);
  w('');

  w('─'.repeat(80));
  w('  EXECUTIVE SUMMARY');
  w('─'.repeat(80));
  w(`  Pages OK:                     ${results.scanned - results.broken.length - results.serverErrors.length - results.redirected.length}`);
  w(`  Broken links (4xx):           ${results.broken.length}`);
  w(`  Server errors (5xx):          ${results.serverErrors.length}`);
  w(`  Redirects (3xx):              ${results.redirected.length}`);
  w(`  Missing page titles:          ${results.titles.missing.length}`);
  w(`  Short titles (<30 chars):     ${results.titles.short.length}`);
  w(`  Long titles (>60 chars):      ${results.titles.long.length}`);
  w(`  Duplicate titles:             ${results.titles.duplicates.length}`);
  w(`  Missing meta descriptions:    ${results.descriptions.missing.length}`);
  w(`  Short desc (<50 chars):       ${results.descriptions.short.length}`);
  w(`  Long desc (>160 chars):       ${results.descriptions.long.length}`);
  w(`  Duplicate descriptions:       ${results.descriptions.duplicates.length}`);
  w(`  No H1 tag:                    ${results.noH1.length}`);
  w(`  Multiple H1 tags:             ${results.multipleH1.length}`);
  w(`  No canonical tag:             ${results.noCanonical.length}`);
  w(`  Missing OG tags:              ${results.noOg.length}`);
  w(`  Thin content (<500b):         ${results.thinContent.length}`);
  w('');

  // Per-page summary table
  w('─'.repeat(80));
  w('  PER-PAGE SEO AUDIT');
  w('─'.repeat(80));
  w(`  ${'URL'.padEnd(45)} ${'Title'.padEnd(8)} ${'Desc'.padEnd(8)} ${'H1'.padEnd(8)} ${'Canon'} ${'OG'}`);
  w(`  ${''.padEnd(45, '─')} ${''.padEnd(8, '─')} ${''.padEnd(8, '─')} ${''.padEnd(8, '─')} ${''.padEnd(5, '─')} ${''.padEnd(2, '─')}`);
  for (const [url] of Object.entries(results.allTitles).sort()) {
    const t = results.allTitles[url];
    const d = results.allDescriptions[url];
    const flags = [];
    if (!t) flags.push('NO-TITLE');
    else if (t.length < 30) flags.push('SHORT-TITLE');
    else if (t.length > 60) flags.push('LONG-TITLE');
    if (!d) flags.push('NO-DESC');
    else if (d.length < 50) flags.push('SHORT-DESC');
    else if (d.length > 160) flags.push('LONG-DESC');
    const flagStr = flags.length ? ` ⚠ ${flags.join(', ')}` : '';
    w(`  ${url}${flagStr}`);
  }
  w('');

  if (results.broken.length > 0) {
    w('─'.repeat(80));
    w('  BROKEN LINKS (4xx Errors)');
    w('─'.repeat(80));
    for (const b of results.broken) {
      w(`  URL:    ${b.url}`);
      w(`  Status: ${b.status || 'timeout/error'}`);
      if (results.sourceMap[b.url]) {
        w(`  Found on:`);
        for (const src of results.sourceMap[b.url]) w(`    - ${src}`);
      }
      w('');
    }
  }

  if (results.serverErrors.length > 0) {
    w('─'.repeat(80));
    w('  SERVER ERRORS (5xx) — CRITICAL');
    w('─'.repeat(80));
    for (const b of results.serverErrors) w(`  ${b.url} (${b.status})`);
    w('');
  }

  if (results.titles.missing.length > 0) {
    w('─'.repeat(80));
    w('  MISSING PAGE TITLES — HIGH PRIORITY');
    w('─'.repeat(80));
    for (const u of results.titles.missing) w(`  ${u}`);
    w('');
  }

  if (results.titles.short.length > 0) {
    w('─'.repeat(80));
    w('  SHORT TITLES (< 30 chars)');
    w('─'.repeat(80));
    for (const t of results.titles.short.slice(0, 20)) w(`  ${t.url}\n    "${t.title}" (${t.length} chars)`);
    if (results.titles.short.length > 20) w(`  ... and ${results.titles.short.length - 20} more`);
    w('');
  }

  if (results.titles.long.length > 0) {
    w('─'.repeat(80));
    w('  LONG TITLES (> 60 chars) — may be truncated in SERPs');
    w('─'.repeat(80));
    for (const t of results.titles.long.slice(0, 20)) w(`  ${t.url}\n    "${t.title}" (${t.length} chars)`);
    if (results.titles.long.length > 20) w(`  ... and ${results.titles.long.length - 20} more`);
    w('');
  }

  if (results.titles.duplicates.length > 0) {
    w('─'.repeat(80));
    w('  DUPLICATE TITLES — HARMFUL FOR SEO');
    w('─'.repeat(80));
    for (const d of results.titles.duplicates.slice(0, 10)) {
      w(`  "${d.title}" → ${d.count} pages`);
      for (const u of d.urls) w(`    ${u}`);
    }
    if (results.titles.duplicates.length > 10) w(`  ... and ${results.titles.duplicates.length - 10} more groups`);
    w('');
  }

  if (results.descriptions.missing.length > 0) {
    w('─'.repeat(80));
    w('  MISSING META DESCRIPTIONS — HIGH PRIORITY');
    w('─'.repeat(80));
    for (const u of results.descriptions.missing) w(`  ${u}`);
    w('');
  }

  if (results.descriptions.short.length > 0) {
    w('─'.repeat(80));
    w('  SHORT DESCRIPTIONS (< 50 chars)');
    w('─'.repeat(80));
    for (const d of results.descriptions.short.slice(0, 20)) w(`  ${d.url}\n    "${d.desc}" (${d.length} chars)`);
    w('');
  }

  if (results.descriptions.long.length > 0) {
    w('─'.repeat(80));
    w('  LONG DESCRIPTIONS (> 160 chars) — may be truncated in SERPs');
    w('─'.repeat(80));
    for (const d of results.descriptions.long.slice(0, 20)) w(`  ${d.url}\n    "${d.desc}" (${d.length} chars)`);
    w('');
  }

  if (results.descriptions.duplicates.length > 0) {
    w('─'.repeat(80));
    w('  DUPLICATE META DESCRIPTIONS');
    w('─'.repeat(80));
    for (const d of results.descriptions.duplicates.slice(0, 10)) {
      w(`  "${d.desc.substring(0, 80)}..." → ${d.count} pages`);
    }
    w('');
  }

  if (results.noH1.length > 0) {
    w('─'.repeat(80));
    w('  PAGES WITHOUT H1 TAG — IMPORTANT');
    w('─'.repeat(80));
    for (const u of results.noH1) w(`  ${u}`);
    w('');
  }

  if (results.multipleH1.length > 0) {
    w('─'.repeat(80));
    w('  PAGES WITH MULTIPLE H1 TAGS');
    w('─'.repeat(80));
    for (const h of results.multipleH1) w(`  ${h.url} → ${h.h1s.length} H1s`);
    w('');
  }

  if (results.noCanonical.length > 0) {
    w('─'.repeat(80));
    w('  PAGES WITHOUT CANONICAL TAG');
    w('─'.repeat(80));
    for (const u of results.noCanonical) w(`  ${u}`);
    w('');
  }

  if (results.noOg.length > 0) {
    w('─'.repeat(80));
    w('  PAGES MISSING OPEN GRAPH TAGS — affects social sharing');
    w('─'.repeat(80));
    for (const u of results.noOg) w(`  ${u}`);
    w('');
  }

  if (results.thinContent.length > 0) {
    w('─'.repeat(80));
    w('  THIN CONTENT PAGES (< 500 bytes raw HTML)');
    w('─'.repeat(80));
    for (const u of results.thinContent) w(`  ${u}`);
    w('');
  }

  if (results.redirected.length > 0) {
    w('─'.repeat(80));
    w('  REDIRECTS');
    w('─'.repeat(80));
    for (const r of results.redirected) w(`  ${r.url} → ${r.to} (${r.status})`);
    w('');
  }

  // Recommendations
  w('─'.repeat(80));
  w('  SEO RECOMMENDATIONS');
  w('─'.repeat(80));
  const recs = [];
  if (results.titles.missing.length > 0) recs.push('🔴 Add unique <title> tags to all pages');
  if (results.titles.duplicates.length > 0) recs.push('🔴 Fix duplicate page titles — each page needs a unique title');
  if (results.titles.short.length > 0) recs.push('🟡 Lengthen short titles to at least 30 characters');
  if (results.titles.long.length > 0) recs.push('🟡 Shorten titles to under 60 characters for SERP display');
  if (results.descriptions.missing.length > 0) recs.push('🔴 Add meta descriptions to all pages');
  if (results.descriptions.duplicates.length > 0) recs.push('🟡 Write unique meta descriptions for each page');
  if (results.descriptions.short.length > 0) recs.push('🟡 Meta descriptions should be 50-160 characters');
  if (results.noH1.length > 0) recs.push('🔴 Add an H1 tag to every page');
  if (results.noCanonical.length > 0) recs.push('🟡 Add canonical tags to prevent duplicate content issues');
  if (results.noOg.length > 0) recs.push('🟡 Add Open Graph tags for better social sharing');
  if (results.broken.length > 0) recs.push('🔴 Fix broken links — they harm user experience and crawl budget');
  if (results.serverErrors.length > 0) recs.push('🔴 Fix server errors immediately — they prevent indexing');
  if (results.redirected.length > 0) recs.push('🟡 Review redirects to ensure they\'re necessary and correct');
  if (results.sitemapBlocked) recs.push('🔴 Sitemap.xml returns 403 — fix access so Google can discover pages');
  for (const r of recs) w(`  ${r}`);
  w('');

  w('─'.repeat(80));
  w('  END OF REPORT');
  w('─'.repeat(80));

  return report.join('\n');
}

async function main() {
  console.log(`\n🔍 Fetching sitemap from ${BASE_URL}/sitemap.xml ...`);
  const sitemapUrls = await fetchSitemap();
  if (sitemapUrls.length === 0) {
    console.log('⚠️  Sitemap returned no URLs — will discover pages via crawling');
    results.sitemapBlocked = true;
  } else {
    console.log(`📄 Found ${sitemapUrls.length} URLs in sitemap`);
  }

  const toCrawl = [...new Set(sitemapUrls.map(u => u.replace(/\/$/, '')))];

  // Always crawl homepage first to discover internal links
  if (!toCrawl.includes(BASE_URL)) toCrawl.unshift(BASE_URL);

  console.log(`\n🔎 Starting crawl (max ${MAX_PAGES} pages)...\n`);

  for (const url of toCrawl) {
    if (results.scanned >= MAX_PAGES) break;
    await crawlUrl(url);
  }

  console.log(`\n📊 Generating report...`);

  const report = await generateReport();

  const fs = await import('fs');
  const reportFile = new URL('../scratch/seo-crawl-report.txt', import.meta.url);
  fs.mkdirSync(new URL('../scratch', import.meta.url), { recursive: true });
  fs.writeFileSync(reportFile, report, 'utf-8');

  // Also write CSV
  const csv = ['url,has_title,title_length,has_description,desc_length,has_h1,num_h1s,has_canonical,has_og,status'];
  for (const [url] of Object.entries(results.allTitles).sort()) {
    const t = results.allTitles[url];
    const d = results.allDescriptions[url];
    const h1count = results.noH1.includes(url) ? 0 : results.multipleH1.find(h => h.url === url)?.h1s.length || 1;
    csv.push(`${url},${t ? 'yes' : 'no'},${t ? t.length : 0},${d ? 'yes' : 'no'},${d ? d.length : 0},${!results.noH1.includes(url)},${h1count},${!results.noCanonical.includes(url)},${!results.noOg.includes(url)},200`);
  }
  const csvFile = new URL('../scratch/seo-crawl-data.csv', import.meta.url);
  fs.writeFileSync(csvFile, csv.join('\n'), 'utf-8');

  console.log(`✅ Report written to scratch/seo-crawl-report.txt`);
  console.log(`✅ CSV data written to scratch/seo-crawl-data.csv`);
  console.log(report);
}

main().catch(console.error);
