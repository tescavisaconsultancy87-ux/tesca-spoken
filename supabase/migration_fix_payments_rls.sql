-- Migration: Allow users to view their own payments in the database
-- Run this in the SQL Editor on your Supabase dashboard

DROP POLICY IF EXISTS "Allow users to view own payments" ON payments;
CREATE POLICY "Allow users to view own payments" ON payments
  FOR SELECT USING (email = auth.jwt()->>'email');
