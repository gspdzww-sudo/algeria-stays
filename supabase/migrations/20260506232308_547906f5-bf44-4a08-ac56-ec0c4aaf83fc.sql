
-- Allow image attachments in messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.messages ALTER COLUMN content DROP NOT NULL;
ALTER TABLE public.messages ADD CONSTRAINT messages_content_or_image CHECK (
  (content IS NOT NULL AND length(trim(content)) > 0) OR image_url IS NOT NULL
);

-- Private bucket for chat images
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', false)
ON CONFLICT (id) DO NOTHING;

-- Path layout: {booking_id}/{filename}
-- Only booking participants can read/write their booking's images
CREATE POLICY "Chat images: participants can view"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-images'
  AND public.is_booking_participant(
    ((storage.foldername(name))[1])::uuid,
    auth.uid()
  )
);

CREATE POLICY "Chat images: participants can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-images'
  AND public.is_booking_participant(
    ((storage.foldername(name))[1])::uuid,
    auth.uid()
  )
);

CREATE POLICY "Chat images: uploader can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-images'
  AND owner = auth.uid()
);
