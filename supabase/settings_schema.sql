-- ==========================================================
-- System Settings Table Migration
-- ==========================================================

CREATE TABLE IF NOT EXISTS system_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  school_name TEXT NOT NULL DEFAULT 'TESCA Spoken English',
  contact_email TEXT NOT NULL DEFAULT 'contact@tesca.com',
  support_phone TEXT NOT NULL DEFAULT '+91 98765 43210',
  currency TEXT NOT NULL DEFAULT 'INR (₹)',
  enable_registrations BOOLEAN NOT NULL DEFAULT TRUE,
  maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
  enable_free_test BOOLEAN NOT NULL DEFAULT TRUE,
  show_offer_banner BOOLEAN NOT NULL DEFAULT TRUE,
  show_timer BOOLEAN NOT NULL DEFAULT TRUE,
  timer_expiry_type TEXT NOT NULL DEFAULT 'rolling',
  timer_fixed_expiry TEXT NOT NULL DEFAULT '',
  show_progress_bar BOOLEAN NOT NULL DEFAULT TRUE,
  claimed_percentage INTEGER NOT NULL DEFAULT 85,
  progress_bar_text TEXT NOT NULL DEFAULT '🔥 [percentage]% of promotional seats claimed',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed initial row if it does not exist yet
INSERT INTO system_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to system_settings
CREATE POLICY "Allow public read access to system_settings" ON system_settings
  FOR SELECT USING (true);

-- Allow admins full access to system_settings
CREATE POLICY "Allow admins full access to system_settings" ON system_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );
