-- Create Trainers Table
CREATE TABLE IF NOT EXISTS trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  experience TEXT,
  certification TEXT,
  students TEXT,
  specialization TEXT,
  photo TEXT,
  verified BOOLEAN DEFAULT true NOT NULL,
  show_on_homepage BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

-- Set up policies
CREATE POLICY "Allow public read access to trainers" ON trainers FOR SELECT USING (true);

CREATE POLICY "Allow full admin control on trainers" ON trainers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Seed Initial Trainers
INSERT INTO trainers (id, name, role, experience, certification, students, specialization, photo, verified, show_on_homepage) VALUES
('trainer-1', 'Dr. Anjali Desai', 'Lead IELTS Trainer', '18 years', 'CELTA, TESOL', '2,400+', 'IELTS Speaking & Writing', 'https://images.pexels.com/photos/5212343/pexels-photo-5212343.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', true, true),
('trainer-2', 'James Whitfield', 'Native English Expert', '12 years', 'DELTA, MA Linguistics', '1,800+', 'Accent Neutralization', 'https://images.pexels.com/photos/5212702/pexels-photo-5212702.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', true, true),
('trainer-3', 'Meera Krishnan', 'PTE & Communication Coach', '10 years', 'TEFL, PTE Certified', '1,500+', 'PTE Academic', 'https://images.pexels.com/photos/5212295/pexels-photo-5212295.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', true, true),
('trainer-4', 'Rohan Mehta', 'Corporate Communication Trainer', '14 years', 'MBA, TESOL', '2,100+', 'Interview & Corporate English', 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', true, true)
ON CONFLICT (id) DO NOTHING;
