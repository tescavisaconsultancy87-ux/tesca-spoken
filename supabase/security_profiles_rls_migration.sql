-- Security migration: remove public profile reads and avoid recursive profile policies.
-- Run this once in the Supabase SQL editor for the live project.

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid()
$$;

REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users and admins read profiles" ON public.profiles;

CREATE POLICY "Allow users and admins read profiles" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.current_user_role() = 'admin');

-- Keep self-profile updates locked to the caller and prevent role escalation.
DROP POLICY IF EXISTS "Allow individual write access to own profile" ON public.profiles;
CREATE POLICY "Allow individual write access to own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role::text IS NOT DISTINCT FROM public.current_user_role());

