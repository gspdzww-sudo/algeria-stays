-- Fix 1: Remove the overly permissive public SELECT policy on profiles
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;

-- Fix 2: Add WITH CHECK to UPDATE policy to prevent role escalation
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND role = (SELECT p.role FROM public.profiles p WHERE p.user_id = auth.uid()));