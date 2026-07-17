-- Migration: Create the public storage bucket for assets and enable uploads
-- Run this in the Supabase SQL Editor if the bucket does not exist

-- 1. Create the 'tesca-assets' storage bucket (public, 5MB limit, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tesca-assets',
  'tesca-assets',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- 2. Allow public read access to objects in the bucket
DROP POLICY IF EXISTS "Public read access on tesca-assets" ON storage.objects;
CREATE POLICY "Public read access on tesca-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'tesca-assets');

-- 3. Allow uploads (for flyer images) into the bucket
DROP POLICY IF EXISTS "Allow uploads to tesca-assets" ON storage.objects;
CREATE POLICY "Allow uploads to tesca-assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tesca-assets');

-- 4. Allow deletes (for cleanup) in the bucket
DROP POLICY IF EXISTS "Allow deletes on tesca-assets" ON storage.objects;
CREATE POLICY "Allow deletes on tesca-assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'tesca-assets');
