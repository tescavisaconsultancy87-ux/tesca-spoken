-- Migration: Add author_id to blog_posts and update RLS policies
-- Run this on your Supabase SQL editor

-- 1. Add author_id column to blog_posts referencing profiles table (if it doesn't exist)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- 2. Drop existing policies on blog_posts table
DROP POLICY IF EXISTS "Allow public read access to published posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow admins full control on blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow select access to published or own posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow insert access to admin, tutor, and student" ON blog_posts;
DROP POLICY IF EXISTS "Allow update access to admin, or own posts for tutor/student" ON blog_posts;
DROP POLICY IF EXISTS "Allow delete access to admin, or own posts for tutor/student" ON blog_posts;

-- 3. Create updated RLS policies

-- SELECT policy: Allow anyone to read published posts, and authors/admins to read any post
CREATE POLICY "Allow select access to published or own posts" ON blog_posts
  FOR SELECT USING (
    published = true 
    OR author_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- INSERT policy: Allow admins, tutors, and students to insert posts. For tutors and students, the author_id must match their own UID.
CREATE POLICY "Allow insert access to admin, tutor, and student" ON blog_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'tutor', 'student')
    ) 
    AND (
      author_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    )
  );

-- UPDATE policy: Allow admins to update any post, and tutors/students to update their own posts
CREATE POLICY "Allow update access to admin, or own posts for tutor/student" ON blog_posts
  FOR UPDATE USING (
    author_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- DELETE policy: Allow admins to delete any post, and tutors/students to delete their own posts
CREATE POLICY "Allow delete access to admin, or own posts for tutor/student" ON blog_posts
  FOR DELETE USING (
    author_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
