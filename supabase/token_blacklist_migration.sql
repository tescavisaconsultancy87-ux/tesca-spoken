-- Migration: Add token blacklist for session revocation on logout
CREATE TABLE IF NOT EXISTS token_blacklist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invalidated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_token_blacklist_hash ON token_blacklist(token_hash);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_user ON token_blacklist(user_id);

ALTER TABLE token_blacklist ENABLE ROW LEVEL SECURITY;

-- Cleanup expired entries (tokens older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_token_blacklist()
RETURNS void
LANGUAGE sql
AS $$
  DELETE FROM token_blacklist WHERE invalidated_at < NOW() - INTERVAL '24 hours';
$$;
