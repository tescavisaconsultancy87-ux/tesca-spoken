-- Migration: Add follow-up history, next follow-up date, and status reason to leads table
-- Run this script in your Supabase SQL Editor

ALTER TABLE leads ADD COLUMN IF NOT EXISTS follow_ups JSONB DEFAULT '[]'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_followup_date TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status_reason TEXT;

-- Index for CRM leads dashboard sorting by next follow-up date
CREATE INDEX IF NOT EXISTS idx_leads_next_followup ON leads(next_followup_date);
