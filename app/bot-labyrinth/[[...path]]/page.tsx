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

export async function generateMetadata({ params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams?.path || [];
  const currentPath = Array.isArray(pathSegments) ? pathSegments.join('/') : '';
  const seed = seededHash(currentPath || 'entry');
  const title = currentPath ? pick(FAKE_TITLES, seed, 0) : 'Comprehensive English Learning Resources';
  const p1 = pick(FAKE_PARAGRAPHS, seed, 1);

  return {
    title,
    description: `${p1.slice(0, 155)}...`,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `https://tesca.co/bot-labyrinth/${currentPath}`,
    },
  };
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
  const shownTags = [...TAGS].sort((a, b) => pickIndex(seed, a.charCodeAt(0), 3) - pickIndex(seed, b.charCodeAt(0), 3)).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#333] font-sans antialiased">
      <header className="bg-[#0d4f4f] text-white px-6 py-4">
        <div className="max-w-[1100px] mx-auto flex justify-between items-center">
          <strong className="text-base">TESCA Learning Hub</strong>
          <nav className="flex gap-5 text-sm">
            <a href="/bot-labyrinth/home" className="hover:underline">Home</a>
            <a href="/bot-labyrinth/courses" className="hover:underline">Courses</a>
            <a href="/bot-labyrinth/blog" className="hover:underline">Blog</a>
            <a href="/bot-labyrinth/resources" className="hover:underline">Resources</a>
            <a href="/bot-labyrinth/about" className="hover:underline">About</a>
          </nav>
        </div>
      </header>

      <div className="max-w-[800px] mx-auto p-6">
        <div className="text-[13px] text-gray-500 mb-5">
          <a href="/bot-labyrinth/home" className="text-[#0d4f4f] hover:underline">Home</a> &raquo;
          {currentPath ? (
            <>
              <a href={`/bot-labyrinth/${currentPath.split('/').slice(0, -1).join('/')}`} className="text-[#0d4f4f] hover:underline"> Category</a> &raquo;
              <span> {title.slice(0, 40)}</span>
            </>
          ) : (
            <span> Learning Resources</span>
          )}
        </div>

        <article className="bg-white rounded-lg p-8 shadow-xs">
          <h1 className="text-2xl font-bold text-[#0d4f4f] mb-2">{title}</h1>
          <div className="text-[13px] text-gray-500 mb-5">
            By {author} &middot; {dateStr} &middot; {views} views
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">{p1}</p>
          <p className="text-gray-700 leading-relaxed mb-4">{p2}</p>
          <p className="text-gray-700 leading-relaxed mb-4">{p3}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {shownTags.map((t) => (
              <span key={t} className="bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </article>

        <div className="mt-6 bg-white rounded-lg p-5 shadow-xs">
          <h2 className="text-base font-semibold text-[#0d4f4f] border-b-2 border-[#0d4f4f] pb-1.5 mb-3">Related Articles</h2>
          <ul className="space-y-2">
            {links.map((link, i) => (
              <li key={i}><a href={link.href} className="text-blue-600 hover:underline text-sm">{link.label}</a></li>
            ))}
          </ul>
          <h2 className="text-base font-semibold text-[#0d4f4f] border-b-2 border-[#0d4f4f] pb-1.5 mt-4 mb-3">Popular Resources</h2>
          <ul className="space-y-2">
            {links.slice(0, 6).map((link, i) => (
              <li key={`pop-${i}`}>
                <a href={`/bot-labyrinth/resource/${link.href.split('/').pop()}`} className="text-blue-600 hover:underline text-sm">
                  {pick(FAKE_TITLES, seed, i + 100)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="bg-[#0d4f4f] text-gray-300 text-center py-4 text-xs mt-8">
        &copy; 2026 TESCA Learning Hub. All rights reserved.
      </footer>
    </div>
  );
}
