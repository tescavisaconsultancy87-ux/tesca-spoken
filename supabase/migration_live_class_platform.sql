-- Migration: Add platform selection and meeting credentials to live_classes
-- Run this on your Supabase SQL editor

ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'google_meet';
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS meeting_id TEXT;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS meeting_password TEXT;
