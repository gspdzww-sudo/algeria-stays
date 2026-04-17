-- Drop the overly broad SELECT policy and replace with a more restrictive one
DROP POLICY IF EXISTS "Property images are publicly accessible" ON storage.objects;

-- Public access via direct URL only (not listing) - Supabase serves public files via CDN
-- We restrict the SELECT (listing) to only the owner of the folder
CREATE POLICY "Owners can list their property images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'property-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);