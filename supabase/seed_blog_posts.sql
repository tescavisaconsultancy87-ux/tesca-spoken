-- ==========================================================
-- TESCA Blog Posts Seed Script
-- Run this script in your Supabase SQL Editor to populate starter blog posts.
-- ==========================================================

-- Ensure category column exists
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Spoken English';

-- Insert default blog posts if table is empty
INSERT INTO blog_posts (title, slug, excerpt, content, author, category, image_url, published, created_at)
VALUES 
(
  'Day 26 Information: All 26 Days Main Topics in One',
  'day-26-information-all-topics-in-one',
  'A complete summary and quick recap of all 26 key spoken English modules and grammar topics covered in the course.',
  '<p>Welcome to Day 26 of our Spoken English Mastery course! Today, we recap all major topics covered throughout the 26-day intensive curriculum, including tense structures, active listening, idiom usage, and fluency exercises.</p><p>Reviewing these foundational concepts regularly will help solidify your spoken English skills and build natural confidence during everyday conversations.</p>',
  'TESCA Team',
  'Spoken English',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
  true,
  NOW() - INTERVAL '6 days'
),
(
  'Your English Journey Starts Today: Essential Daily Habits',
  'your-english-journey-starts-today',
  'Discover actionable habits you can practice every day to transform your English fluency and gain confidence.',
  '<p>Embarking on a journey to speak English fluently doesn’t happen overnight, but small, consistent daily habits produce massive results over time.</p><p>Key daily practices include: 1) Speaking out loud for at least 15 minutes a day, 2) Thinking in English instead of translating, 3) Recording your voice to track pronunciation progress, and 4) Engaging in active listening with podcasts and interactive conversations.</p>',
  'TESCA Team',
  'Spoken English',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  true,
  NOW() - INTERVAL '5 days'
),
(
  'Reading the Examiner''s Mind: 6 Paragraph Structures You Need to Know (Part 3)',
  'reading-the-examiners-mind-6-paragraph-structures',
  'Want to score Band 8+ in IELTS Reading & Writing? Learn how to identify and structure complex paragraphs effortlessly.',
  '<p>Understanding IELTS paragraph structures is essential for achieving Band 8.0 or higher in Reading and Writing modules.</p><p>In Part 3 of this series, we break down paragraph organisation patterns, including Cause-and-Effect, Problem-Solution, Compare-Contrast, and Claim-Evidence frameworks. Recognizing these structures allows you to scan passages faster and answer detail-oriented questions accurately under timed exam conditions.</p>',
  'Parth Shershiya',
  'IELTS',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
  true,
  NOW() - INTERVAL '4 days'
),
(
  'Why Choose TESCA for Spoken English?',
  'why-choose-tesca-for-spoken-english',
  'Learn about TESCA’s proven methodology, Cambridge-certified trainers, and personalized coaching designed for your success.',
  '<p>TESCA has been empowering learners in Surat and across Gujarat since 2005. Our interactive, batch-capped spoken English training focuses on practical communication rather than rote memorization.</p><p>With experienced Cambridge-certified trainers, 1-on-1 feedback sessions, and immersive audio-visual speaking labs, TESCA provides the ideal environment to master fluent English for careers, exams, and visa interviews.</p>',
  'Meet Sir',
  'Spoken English',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  true,
  NOW() - INTERVAL '3 days'
),
(
  'Take the 30-Day Spoken English Challenge',
  'take-the-30-day-spoken-english-challenge',
  'Transform your speaking fluency with our step-by-step 30-day practice routine designed for beginner and intermediate speakers.',
  '<p>Commit to 30 days of targeted spoken English practice! Each day focuses on a specific conversational scenario—ranging from introducing yourself professionally to expressing opinions and navigating job interviews.</p><p>Join hundreds of successful TESCA students who have unlocked fluency through this interactive challenge.</p>',
  'Meet Sir',
  'Spoken English',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  true,
  NOW() - INTERVAL '2 days'
),
(
  'Mastering PTE Speaking: Repeat Sentence & Read Aloud Strategies',
  'mastering-pte-speaking-repeat-sentence-and-read-aloud',
  'Crack the PTE Academic speaking section with top tips for oral fluency, native stress patterns, and AI scoring optimization.',
  '<p>The PTE Academic exam relies on AI algorithms to score your speech rate, oral fluency, and pronunciation. In this guide, we share proven strategies for Repeat Sentence and Read Aloud items.</p><p>Focus on maintaining a steady rhythm without hesitation, avoiding artificial pauses, and emphasizing key content words to maximize your Enabling Skills score.</p>',
  'TESCA Team',
  'PTE',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  true,
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (slug) DO NOTHING;
