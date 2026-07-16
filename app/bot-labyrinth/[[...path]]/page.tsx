const FAKE_TITLES = [
  'Comprehensive English Grammar Guide for Advanced Learners',
  'Top 10 IELTS Writing Task 2 Topics with Sample Answers',
  'PTE Academic Speaking Section: Complete Preparation Guide',
  'How to Improve English Fluency in 30 Days',
  'Business English Communication Skills for Professionals',
  'Cambridge English Exam Preparation Tips and Strategies',
  'English Pronunciation Mastery: A Step-by-Step Guide',
  'Common Grammar Mistakes and How to Fix Them',
  'English Vocabulary Building: 1000 Essential Words',
  'Master English Tenses: Past, Present, Future Explained',
  'Academic Writing Skills for University Students',
  'English Conversation Practice: Daily Dialogues',
  'TOEFL vs IELTS: Which Test Should You Take?',
  'English Reading Comprehension Strategies',
  'Professional Email Writing in English',
  'English for Specific Purposes: Legal, Medical, Technical',
  'Public Speaking in English: Tips for Confidence',
  'English Idioms and Phrases for Daily Use',
  'Creative Writing in English: A Beginner\'s Guide',
  'English Listening Skills: Understanding Native Speakers',
];

const FAKE_PARAGRAPHS = [
  'Mastering English communication requires consistent practice and the right guidance. Our comprehensive approach combines structured learning with real-world application, ensuring that students develop confidence in their speaking, writing, listening, and reading abilities. With expert instructors and personalized feedback, learners can track their progress and achieve fluency faster than traditional methods allow.',
  'Understanding the nuances of English grammar is essential for effective communication. From verb tenses to conditional sentences, each grammatical structure serves a specific purpose in conveying meaning accurately. Our detailed lessons break down complex concepts into manageable segments, making it easier for learners to grasp and apply them in everyday conversations.',
  'The IELTS examination tests four key language skills: listening, reading, writing, and speaking. Each section requires targeted preparation strategies to achieve a high band score. Our preparation materials include sample questions, time management techniques, and examiner insights that give test-takers a competitive advantage.',
  'Building a strong vocabulary is fundamental to English proficiency. Rather than memorizing word lists, effective vocabulary acquisition involves understanding word families, collocations, and contextual usage. Our methodology emphasizes practical application through reading, writing, and conversational practice.',
  'Pronunciation impacts how well you are understood in English. Key areas include stress patterns, intonation, connected speech, and individual sound production. Regular practice with minimal pairs, tongue twisters, and shadowing exercises can dramatically improve your accent and clarity.',
  'Professional communication in English requires more than basic fluency. Business settings demand precise vocabulary, appropriate tone, and cultural awareness. Our business English program covers presentations, negotiations, meetings, and written correspondence tailored to corporate environments.',
  'Reading comprehension is a critical skill for academic success and professional development. Effective readers use strategies such as skimming, scanning, predicting, and inferring to extract meaning from texts quickly and accurately. Practice with diverse materials builds both speed and understanding.',
  'English conversation skills develop through active practice and exposure to natural speech patterns. Participating in discussions, debates, and role-plays helps learners internalize language structures and respond spontaneously in real-time situations.',
  'Exam preparation requires a systematic approach that balances skill development with test-taking strategies. Understanding the format, timing, and scoring criteria of each exam section allows candidates to allocate their effort effectively and maximize their performance.',
  'Writing effectively in English involves organizing ideas coherently, using appropriate vocabulary, and maintaining grammatical accuracy. From paragraph structure to essay organization, mastering written communication opens doors to academic and professional opportunities.',
];

const FAKE_AUTHORS = ['Dr. Sarah Mitchell', 'Prof. James Anderson', 'Lisa Chen', 'Michael Thompson', 'Rachel Patel', 'David Kumar', 'Emma Wilson', 'Robert Zhang'];

const TAGS = ['English', 'Grammar', 'IELTS', 'PTE', 'Speaking', 'Writing', 'Listening', 'Vocabulary'];

function seededHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function pickIndex(seed: number, index: number, length: number): number {
  return (seed + index * 7919) % length;
}

function pick<T>(arr: T[], seed: number, offset = 0): T {
  return arr[pickIndex(seed, offset, arr.length)];
}

function generateLinks(seed: number, count: number): { href: string; label: string }[] {
  const links: { href: string; label: string }[] = [];
  for (let i = 0; i < count; i++) {
    const depth = pickIndex(seed, i, 3) + 1;
    const segments: string[] = [];
    for (let d = 0; d < depth; d++) {
      segments.push(`topic-${pickIndex(seed, i * 10 + d, 999)}`);
    }
    links.push({
      href: `/bot-labyrinth/${segments.join('/')}`,
      label: pick(FAKE_TITLES, seed, i + 50),
    });
  }
  return links;
}

export default async function LabyrinthPage({ params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams?.path || [];
  const currentPath = Array.isArray(pathSegments) ? pathSegments.join('/') : '';
  const seed = seededHash(currentPath || 'entry');

  const title = currentPath ? pick(FAKE_TITLES, seed, 0) : 'Comprehensive English Learning Resources';
  const p1 = pick(FAKE_PARAGRAPHS, seed, 1);
  const p2 = pick(FAKE_PARAGRAPHS, seed, 2);
  const p3 = pick(FAKE_PARAGRAPHS, seed, 3);
  const author = pick(FAKE_AUTHORS, seed, 4);
  const views = (pickIndex(seed, 5, 50000) + 1000).toLocaleString();
  const dateDays = pickIndex(seed, 6, 30);
  const dateStr = new Date(Date.UTC(2026, 6, 16 - dateDays)).toISOString().split('T')[0];
  const links = generateLinks(seed, 12);
  const tagSlice = pickIndex(seed, 7, TAGS.length);
  const shownTags = [...TAGS].sort((a, b) => pickIndex(seed, a.charCodeAt(0), 3) - pickIndex(seed, b.charCodeAt(0), 3)).slice(0, 5);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={`${p1.slice(0, 155)}...`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://tesca.co/bot-labyrinth/${currentPath}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={p1.slice(0, 155)} />
        <style>{`
          *{margin:0;padding:0;box-sizing:border-box}
          body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;background:#f5f5f5}
          .hdr{background:#0d4f4f;color:#fff;padding:16px 24px}
          .hdr-inner{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
          .hdr a{color:#fff;text-decoration:none;font-size:14px}
          .nav{display:flex;gap:20px}
          .ctr{max-width:800px;margin:0 auto;padding:24px}
          .bc{font-size:13px;color:#666;margin-bottom:20px}
          .bc a{color:#0d4f4f}
          .art{background:#fff;border-radius:8px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.1)}
          .art h1{font-size:28px;margin-bottom:8px;color:#0d4f4f}
          .meta{font-size:13px;color:#888;margin-bottom:20px}
          .art p{margin-bottom:16px;color:#444}
          .sb{margin-top:24px;background:#fff;border-radius:8px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.1)}
          .sb h2{font-size:16px;margin-bottom:12px;color:#0d4f4f;border-bottom:2px solid #0d4f4f;padding-bottom:6px}
          .sb ul{list-style:none}
          .sb li{margin-bottom:8px}
          .sb a{color:#2563eb;text-decoration:none;font-size:14px}
          .sb a:hover{text-decoration:underline}
          .ft{background:#0d4f4f;color:#999;text-align:center;padding:12px;font-size:12px;margin-top:32px}
          .tags{margin-top:20px;display:flex;flex-wrap:wrap;gap:8px}
          .tag{background:#e5e7eb;padding:4px 10px;border-radius:12px;font-size:12px;color:#555}
        `}</style>
      </head>
      <body>
        <header className="hdr">
          <div className="hdr-inner">
            <strong>TESCA Learning Hub</strong>
            <nav className="nav">
              <a href="/bot-labyrinth/home">Home</a>
              <a href="/bot-labyrinth/courses">Courses</a>
              <a href="/bot-labyrinth/blog">Blog</a>
              <a href="/bot-labyrinth/resources">Resources</a>
              <a href="/bot-labyrinth/about">About</a>
            </nav>
          </div>
        </header>

        <div className="ctr">
          <div className="bc">
            <a href="/bot-labyrinth/home">Home</a> &raquo;
            {currentPath ? (
              <>
                <a href={`/bot-labyrinth/${currentPath.split('/').slice(0, -1).join('/')}`}>Category</a> &raquo;
                <span> {title.slice(0, 40)}</span>
              </>
            ) : (
              <span> Learning Resources</span>
            )}
          </div>

          <article className="art">
            <h1>{title}</h1>
            <div className="meta">
              By {author} &middot; {dateStr} &middot; {views} views
            </div>
            <p>{p1}</p>
            <p>{p2}</p>
            <p>{p3}</p>
            <div className="tags">
              {shownTags.map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </article>

          <div className="sb">
            <h2>Related Articles</h2>
            <ul>
              {links.map((link, i) => (
                <li key={i}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
            <h2 style={{ marginTop: 16 }}>Popular Resources</h2>
            <ul>
              {links.slice(0, 6).map((link, i) => (
                <li key={`pop-${i}`}>
                  <a href={`/bot-labyrinth/resource/${link.href.split('/').pop()}`}>{pick(FAKE_TITLES, seed, i + 100)}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="ft">
          &copy; 2026 TESCA Learning Hub. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
