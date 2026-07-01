-- Migration: Add Batches table and link live_classes to batches
-- Run this on your Supabase SQL editor

CREATE TABLE IF NOT EXISTS batches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  time_period TEXT NOT NULL,
  student_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create
DROP POLICY IF EXISTS "Allow public read access to batches" ON batches;
DROP POLICY IF EXISTS "Allow full control to tutor and admin on batches" ON batches;

CREATE POLICY "Allow public read access to batches" ON batches FOR SELECT USING (true);
CREATE POLICY "Allow full control to tutor and admin on batches" ON batches FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'tutor' OR profiles.role = 'admin'))
);

-- Add batch_id column to live_classes if it does not exist
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS batch_id TEXT;
