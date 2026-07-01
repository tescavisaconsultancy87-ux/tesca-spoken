-- Migration: Add phone and city columns to payments table for admin reference
-- Run this on your Supabase SQL editor

ALTER TABLE payments ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS city TEXT;
