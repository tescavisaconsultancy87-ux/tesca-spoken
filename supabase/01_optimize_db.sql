-- ═══════════════════════════════════════════════════════════
-- Database Optimization & Schema Enhancements Migration
-- ═══════════════════════════════════════════════════════════

-- 1. Extend courses table with tags and keywords
ALTER TABLE courses ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';

-- 2. Extend system_settings with global SEO tags
ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS seo_keywords TEXT[] DEFAULT '{}';

-- Ensure notifications table exists before creating indexes on it
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  type TEXT,
  unread BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for notifications if table was created
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Re-create policies for notifications if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Allow users to view own notifications'
  ) THEN
    CREATE POLICY "Allow users to view own notifications" ON public.notifications
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Allow users to update own notifications'
  ) THEN
    CREATE POLICY "Allow users to update own notifications" ON public.notifications
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Allow service role full control on notifications'
  ) THEN
    CREATE POLICY "Allow service role full control on notifications" ON public.notifications
      FOR ALL USING (true);
  END IF;
END
$$;

-- 3. Create Optimization Indexes for fast homepage & dashboard queries

-- Index for fetching approved testimonials on the landing page
CREATE INDEX IF NOT EXISTS idx_testimonials_status_approved 
ON testimonials(status) 
WHERE status = 'approved';

-- Index for listing popular courses
CREATE INDEX IF NOT EXISTS idx_courses_popular 
ON courses(popular) 
WHERE popular = true;

-- Index for listing homepage-enabled trainers
CREATE INDEX IF NOT EXISTS idx_trainers_homepage 
ON trainers(show_on_homepage) 
WHERE show_on_homepage = true;

-- Index for fetching unread student notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
ON public.notifications(user_id, unread) 
WHERE unread = true;

-- Index for CRM leads dashboard sorting by date & status
CREATE INDEX IF NOT EXISTS idx_leads_status_created 
ON leads(status, created_at DESC);

-- Index for transaction queries in the admin panel
CREATE INDEX IF NOT EXISTS idx_payments_status_created 
ON payments(status, created_at DESC);

-- 4. Seed tags and keywords for default courses
UPDATE courses SET 
  tags = ARRAY['Speaking', 'Basic', 'Grammar'], 
  keywords = ARRAY['spoken english', 'english speaking', 'conversation', 'intermediate english'] 
WHERE id = 'spoken-english-intermediate';

UPDATE courses SET 
  tags = ARRAY['Corporate', 'Speaking', 'Interview Prep'], 
  keywords = ARRAY['business english', 'corporate training', 'interview preparation', 'public speaking'] 
WHERE id = 'business-communication';

UPDATE courses SET 
  tags = ARRAY['Vocabulary', 'IELTS', 'PTE'], 
  keywords = ARRAY['ielts preparation', 'pte academic', 'english vocabulary', 'mock tests'] 
WHERE id = 'vocabulary-accelerator';
