-- 1. Create User Roles Type
CREATE TYPE user_role AS ENUM ('student', 'admin');

-- 2. Create User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'student',
  name TEXT,
  level TEXT DEFAULT 'Intermediate (B1)',
  phone TEXT,
  location TEXT,
  needs_password_change BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Ensure the column is added if table already existed
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS needs_password_change BOOLEAN NOT NULL DEFAULT FALSE;

-- Ensure 'tutor' is added to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'tutor';

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid()
$$;

REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO anon, authenticated;

CREATE POLICY "Allow users and admins read profiles" ON profiles
  FOR SELECT USING (auth.uid() = id OR public.current_user_role() = 'admin');

CREATE POLICY "Allow individual write access to own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role::text IS NOT DISTINCT FROM public.current_user_role());

CREATE POLICY "Allow individual insert access to own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id AND role = 'student');

-- 3. Create Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  students_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow full admin control on courses" ON courses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 4. Create Enrollments Table (linking students to courses)
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0 NOT NULL,
  completed_lessons INTEGER DEFAULT 0 NOT NULL,
  last_active TEXT DEFAULT '2 hours ago',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(student_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to view own enrollments" ON enrollments FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Allow users to modify own enrollments" ON enrollments FOR ALL USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 5. Create Live Classes Table
CREATE TABLE IF NOT EXISTS live_classes (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  trainer TEXT NOT NULL,
  date_time TEXT NOT NULL,
  duration TEXT NOT NULL,
  join_url TEXT,
  platform TEXT DEFAULT 'google_meet',
  meeting_id TEXT,
  meeting_password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to live classes" ON live_classes FOR SELECT USING (true);
CREATE POLICY "Allow full admin control on live classes" ON live_classes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 6. Create Study Materials Table
CREATE TABLE IF NOT EXISTS study_materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'grammar', 'vocabulary', 'speaking', 'worksheet'
  format TEXT NOT NULL, -- 'PDF', 'MP3', 'DOCX'
  size TEXT NOT NULL,
  download_url TEXT NOT NULL,
  added_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to authenticated profiles" ON study_materials FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow full admin control on study materials" ON study_materials FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 7. Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  date TEXT NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL, -- 'success', 'failed', 'refunded'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow view access to admins" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 8. Create Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  status TEXT NOT NULL, -- 'new', 'contacted', 'converted'
  date_added TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin access to leads" ON leads FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 9. Create Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  rating INTEGER NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL, -- 'approved', 'hidden'
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to approved testimonials" ON testimonials FOR SELECT USING (status = 'approved');
CREATE POLICY "Allow admins full access to testimonials" ON testimonials FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- ═══════════════════════════════════════════════════════════
-- Seed Initial Data
-- ═══════════════════════════════════════════════════════════

INSERT INTO courses (id, title, price, students_count) VALUES
('spoken-english-intermediate', 'Spoken English Mastery — Intermediate', 29.00, 654),
('business-communication', 'Business Communication & Interview Prep', 49.00, 382),
('vocabulary-accelerator', 'Vocabulary & Idioms Accelerator', 19.00, 384)
ON CONFLICT (id) DO NOTHING;

INSERT INTO live_classes (id, topic, trainer, date_time, duration, join_url) VALUES
('lc-1', 'Vocabulary Blast: Idioms for Social Gatherings', 'Sarah Jenkins', '2026-06-24T16:00', '60 mins', 'https://meet.google.com/abc-defg-hij'),
('lc-2', 'Speaking Challenge: Group Discussion Practice', 'David Vance', '2026-06-25T11:30', '45 mins', 'https://meet.google.com/abc-defg-hij'),
('lc-3', 'Grammar Essentials: Perfecting the Past Tense', 'Emma Watson', '2026-06-25T14:00', '60 mins', NULL),
('lc-4', 'Pronunciation Lab: Hard & Soft Consonant Sounds', 'Sarah Jenkins', '2026-06-22T16:00', '60 mins', NULL),
('lc-5', 'Introductory Speaking Session: Ice Breaking', 'Emma Watson', '2026-06-20T10:00', '45 mins', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO study_materials (id, name, category, format, size, download_url, added_date) VALUES
('mat-1', '100 Common Idioms for Daily Conversation', 'vocabulary', 'PDF', '1.2 MB', '#', 'June 20, 2026'),
('mat-2', 'Irregular Verbs Cheat Sheet & Quiz', 'grammar', 'PDF', '850 KB', '#', 'June 18, 2026'),
('mat-3', 'Daily Pronunciation Practice Audio (Lesson 3)', 'speaking', 'MP3', '14.5 MB', '#', 'June 15, 2026'),
('mat-4', 'Intermediate Conversation Starters Workbook', 'speaking', 'PDF', '3.4 MB', '#', 'June 10, 2026'),
('mat-5', 'Present Perfect vs Past Simple Exercises', 'worksheet', 'DOCX', '220 KB', '#', 'June 05, 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO payments (id, student_name, email, amount, date, method, status) VALUES
('TXN-9021', 'Aarav Patel', 'aarav.patel@gmail.com', 29.00, 'June 23, 2026', 'Visa •••• 4242', 'success'),
('TXN-9020', 'Neha Sharma', 'neha.sharma@yahoo.com', 49.00, 'June 22, 2026', 'Mastercard •••• 8812', 'success'),
('TXN-9019', 'Rahul Kapoor', 'rahul.k@gmail.com', 29.00, 'June 20, 2026', 'Visa •••• 1109', 'failed'),
('TXN-9018', 'Priya Nair', 'priya.nair@outlook.com', 29.00, 'June 18, 2026', 'UPI Transfer', 'success'),
('TXN-9017', 'Devendra Patil', 'dev.patil@gmail.com', 19.00, 'June 15, 2026', 'Visa •••• 9901', 'refunded')
ON CONFLICT (id) DO NOTHING;

INSERT INTO leads (id, name, phone, email, notes, status, date_added) VALUES
('lead-1', 'Vikram Singh', '+91 91234 56789', 'vikram.singh@gmail.com', 'Interested in the Spoken English Mastery course. Prefers morning batches.', 'new', 'June 23, 2026'),
('lead-2', 'Anjali Sharma', '+91 98123 45670', 'anjali.s@yahoo.com', 'Wants to improve business vocabulary for upcoming job interviews.', 'contacted', 'June 22, 2026'),
('lead-3', 'Suresh Patel', '+91 99000 88812', 'suresh.patel@gmail.com', 'Registered for a free level assessment. Waiting for callback.', 'new', 'June 21, 2026'),
('lead-4', 'Meera Deshmukh', '+91 98222 33344', 'meera.d@gmail.com', 'Converted from lead to enrolled student today!', 'converted', 'June 18, 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO testimonials (id, name, course, rating, message, status, date) VALUES
('test-1', 'Rohan Sharma', 'Spoken English Mastery', 5, 'I gained so much confidence! The trainers were amazing and really focused on conversation practices.', 'approved', 'June 18, 2026'),
('test-2', 'Pooja Patel', 'Business Communication', 5, 'The interview preparation sections were a game changer. I cracked my interview at a top MNC!', 'approved', 'June 15, 2026'),
('test-3', 'Amit Verma', 'Vocabulary Accelerator', 4, 'Great course materials and worksheets. My vocabulary improved significantly.', 'hidden', 'June 10, 2026')
ON CONFLICT (id) DO NOTHING;

-- 10. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  type TEXT,
  unread BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow service role full control on notifications" ON public.notifications
  FOR ALL USING (true);


-- 11. Create Trainers Table
CREATE TABLE IF NOT EXISTS trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  experience TEXT,
  certification TEXT,
  students TEXT,
  specialization TEXT,
  photo TEXT,
  verified BOOLEAN DEFAULT true NOT NULL,
  show_on_homepage BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

-- Set up policies
CREATE POLICY "Allow public read access to trainers" ON trainers FOR SELECT USING (true);

CREATE POLICY "Allow full admin control on trainers" ON trainers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Seed Initial Trainers
INSERT INTO trainers (id, name, role, experience, certification, students, specialization, photo, verified, show_on_homepage) VALUES
('trainer-1', 'Dr. Anjali Desai', 'Lead IELTS Trainer', '18 years', 'CELTA, TESOL', '2,400+', 'IELTS Speaking & Writing', 'https://images.pexels.com/photos/5212343/pexels-photo-5212343.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', true, true),
('trainer-2', 'James Whitfield', 'Native English Expert', '12 years', 'DELTA, MA Linguistics', '1,800+', 'Accent Neutralization', 'https://images.pexels.com/photos/5212702/pexels-photo-5212702.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', true, true),
('trainer-3', 'Meera Krishnan', 'PTE & Communication Coach', '10 years', 'TEFL, PTE Certified', '1,500+', 'PTE Academic', 'https://images.pexels.com/photos/5212295/pexels-photo-5212295.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', true, true),
('trainer-4', 'Rohan Mehta', 'Corporate Communication Trainer', '14 years', 'MBA, TESOL', '2,100+', 'Interview & Corporate English', 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', true, true)
ON CONFLICT (id) DO NOTHING;

