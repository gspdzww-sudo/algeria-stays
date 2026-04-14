-- Fix 1: Use a trigger to prevent role changes on profiles
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Changing your own role is not allowed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_role_change_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_role_change();

-- Simplify the profiles UPDATE policy (trigger handles role protection)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fix 2: Use a trigger to prevent price/fee changes on bookings
CREATE OR REPLACE FUNCTION public.prevent_booking_price_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.total_price IS DISTINCT FROM OLD.total_price THEN
    RAISE EXCEPTION 'Changing booking price is not allowed';
  END IF;
  IF NEW.service_fee IS DISTINCT FROM OLD.service_fee THEN
    RAISE EXCEPTION 'Changing service fee is not allowed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_booking_price_change_trigger
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.prevent_booking_price_change();

-- Simplify the bookings UPDATE policy (trigger handles price protection)
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND status IN ('pending', 'cancelled')
);