-- Migration: Add columns to profiles for secure OTP password recovery
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reset_otp TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reset_otp_expires_at TIMESTAMP WITH TIME ZONE;
