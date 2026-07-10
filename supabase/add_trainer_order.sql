-- Migration: Add display_order column to trainers table
-- This enables admins to control the order trainers appear on the website.

ALTER TABLE trainers ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Backfill existing rows with sequential order based on creation date
UPDATE trainers SET display_order = sub.rn FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn FROM trainers
) sub WHERE trainers.id = sub.id;
