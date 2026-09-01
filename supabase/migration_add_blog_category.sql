-- Migration: Add category column to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Spoken English';
