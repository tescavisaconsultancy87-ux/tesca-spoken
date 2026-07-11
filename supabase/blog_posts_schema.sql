-- ==========================================================
-- Blog Posts Table Schema Migration
-- ==========================================================

-- 1. Drop existing table to clean up the outdated columns
DROP TABLE IF EXISTS blog_posts CASCADE;

-- 2. Create the correct blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Policy 1: Allow anyone (including anonymous guests) to view published posts
CREATE POLICY "Allow public read access to published posts" ON blog_posts
  FOR SELECT USING (published = true);

-- Policy 2: Allow admins full access (read, insert, update, delete) to all posts
CREATE POLICY "Allow admins full control on blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
