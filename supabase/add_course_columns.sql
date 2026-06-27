-- 1. Add client-oriented columns to courses table if they do not exist
ALTER TABLE courses ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS level TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS accent TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS benefits TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS popular BOOLEAN DEFAULT false;

-- 2. Update existing seeded courses to match target details
UPDATE courses SET
  original_price = 49.00,
  duration = '4 Months',
  level = 'Intermediate',
  accent = 'secondary',
  benefits = 'Advanced fluency, Public speaking, Business communication, Neutral accent',
  popular = true
WHERE id = 'business-communication';

UPDATE courses SET
  original_price = 39.00,
  duration = '3 Months',
  level = 'Intermediate',
  accent = 'primary',
  benefits = 'Grammar foundations, Vocabulary building, Basic conversation, Pronunciation basics',
  popular = false
WHERE id = 'spoken-english-intermediate';

UPDATE courses SET
  original_price = 29.00,
  duration = '12 Weeks',
  level = 'Vocabulary',
  accent = 'accent',
  benefits = 'AI-scored mock tests, Speaking templates, Writing framework, 65+ score guarantee',
  popular = false
WHERE id = 'vocabulary-accelerator';
