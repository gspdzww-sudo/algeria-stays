-- 1) Restrict columns property owners can change on bookings (only status)
CREATE OR REPLACE FUNCTION public.restrict_owner_booking_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_owner boolean;
  is_guest boolean;
BEGIN
  is_guest := (auth.uid() = OLD.user_id);
  SELECT EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = OLD.property_id AND p.owner_id = auth.uid()
  ) INTO is_owner;

  -- If the actor is the property owner (and not the guest themselves), restrict to status only
  IF is_owner AND NOT is_guest THEN
    IF NEW.property_id IS DISTINCT FROM OLD.property_id
       OR NEW.user_id IS DISTINCT FROM OLD.user_id
       OR NEW.check_in IS DISTINCT FROM OLD.check_in
       OR NEW.check_out IS DISTINCT FROM OLD.check_out
       OR NEW.guests IS DISTINCT FROM OLD.guests
       OR NEW.guest_name IS DISTINCT FROM OLD.guest_name
       OR NEW.guest_email IS DISTINCT FROM OLD.guest_email
       OR NEW.guest_phone IS DISTINCT FROM OLD.guest_phone
       OR NEW.total_price IS DISTINCT FROM OLD.total_price
       OR NEW.service_fee IS DISTINCT FROM OLD.service_fee
       OR NEW.payment_method IS DISTINCT FROM OLD.payment_method
       OR NEW.notes IS DISTINCT FROM OLD.notes
    THEN
      RAISE EXCEPTION 'Property owners can only modify booking status';
    END IF;
  END IF;

  -- If the actor is the guest, restrict to status and notes only
  IF is_guest AND NOT is_owner THEN
    IF NEW.property_id IS DISTINCT FROM OLD.property_id
       OR NEW.user_id IS DISTINCT FROM OLD.user_id
       OR NEW.check_in IS DISTINCT FROM OLD.check_in
       OR NEW.check_out IS DISTINCT FROM OLD.check_out
       OR NEW.guests IS DISTINCT FROM OLD.guests
       OR NEW.guest_name IS DISTINCT FROM OLD.guest_name
       OR NEW.guest_email IS DISTINCT FROM OLD.guest_email
       OR NEW.guest_phone IS DISTINCT FROM OLD.guest_phone
       OR NEW.total_price IS DISTINCT FROM OLD.total_price
       OR NEW.service_fee IS DISTINCT FROM OLD.service_fee
       OR NEW.payment_method IS DISTINCT FROM OLD.payment_method
    THEN
      RAISE EXCEPTION 'Guests can only modify booking status or notes';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS restrict_booking_field_updates ON public.bookings;
CREATE TRIGGER restrict_booking_field_updates
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.restrict_owner_booking_update();

-- 2) Lock down internal trigger-only SECURITY DEFINER functions from API exposure
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_role_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_booking_price_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refresh_property_rating() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.restrict_owner_booking_update() FROM PUBLIC, anon, authenticated;

-- Keep get_user_role and is_booking_participant callable (they are used by clients/RLS),
-- but ensure only authenticated users can execute them.
REVOKE ALL ON FUNCTION public.get_user_role(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.is_booking_participant(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_booking_participant(uuid, uuid) TO authenticated;