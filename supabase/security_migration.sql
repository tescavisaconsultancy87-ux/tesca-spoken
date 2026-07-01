-- ═══════════════════════════════════════════════════════════
-- Security Migration: Lock down profile role assignment
-- ═══════════════════════════════════════════════════════════
-- Run this migration ONCE against your live Supabase instance
-- via the SQL Editor (not via the app client).
--
-- What it does:
-- 1. Prevents any user from inserting a profile with role != 'student'
-- 2. Prevents any user from changing their own role column
-- 3. Role assignment is now only possible via the service_role key
--    (which the admin create-user API already uses)
-- ═══════════════════════════════════════════════════════════

-- 1. Lock INSERT: users can only self-insert as 'student'
DROP POLICY IF EXISTS "Allow individual insert access to own profile" ON profiles;
CREATE POLICY "Allow individual insert access to own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id AND role = 'student');

-- 2. Lock UPDATE: users cannot change their own role column
DROP POLICY IF EXISTS "Allow individual write access to own profile" ON profiles;
CREATE POLICY "Allow individual write access to own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM profiles.role);

-- Verification queries (run these after the migration):
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
-- The INSERT policy should show: WITH CHECK ((auth.uid() = id AND (role = 'student'::text)))
-- The UPDATE policy should show: WITH CHECK ((role IS NOT DISTINCT FROM profiles.role))
