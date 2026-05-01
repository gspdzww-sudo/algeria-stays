-- Messages table for booking-based chat between traveler and partner
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_booking_id ON public.messages(booking_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is a participant in the booking (traveler or property owner)
CREATE OR REPLACE FUNCTION public.is_booking_participant(_booking_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.bookings b
    LEFT JOIN public.properties p ON p.id = b.property_id
    WHERE b.id = _booking_id
      AND (b.user_id = _user_id OR p.owner_id = _user_id)
  );
$$;

-- RLS: participants can view messages
CREATE POLICY "Participants can view messages"
ON public.messages
FOR SELECT
TO authenticated
USING (public.is_booking_participant(booking_id, auth.uid()));

-- RLS: participants can send messages (only as themselves)
CREATE POLICY "Participants can send messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND public.is_booking_participant(booking_id, auth.uid())
);

-- RLS: sender can update their message (e.g. mark read by recipient is handled separately) — allow recipient to mark read
CREATE POLICY "Participants can update read status"
ON public.messages
FOR UPDATE
TO authenticated
USING (public.is_booking_participant(booking_id, auth.uid()))
WITH CHECK (public.is_booking_participant(booking_id, auth.uid()));

-- updated_at trigger
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;