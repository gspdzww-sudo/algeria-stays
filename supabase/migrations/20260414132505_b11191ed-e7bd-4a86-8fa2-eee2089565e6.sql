-- Fix 1: Create a SECURITY DEFINER function to safely get current role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = _user_id LIMIT 1;
$$;

-- Replace the profiles UPDATE policy with one using the secure function
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND role = public.get_user_role(auth.uid()));

-- Fix 2: Harden bookings INSERT - force pending status and valid prices
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

CREATE POLICY "Users can create bookings"
ON public.bookings
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
  AND total_price > 0
  AND service_fee >= 0
);

-- Fix 3: Harden bookings UPDATE - users can only cancel, not confirm or change prices
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND status IN ('pending', 'cancelled')
  AND total_price = (SELECT b.total_price FROM public.bookings b WHERE b.id = id AND b.user_id = auth.uid())
  AND service_fee = (SELECT b.service_fee FROM public.bookings b WHERE b.id = id AND b.user_id = auth.uid())
);