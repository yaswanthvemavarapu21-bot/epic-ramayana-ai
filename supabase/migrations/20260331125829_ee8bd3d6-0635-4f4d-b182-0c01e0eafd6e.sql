
-- Fix overly permissive storage policies for chapter-images bucket
-- Drop the public-role policies and recreate them for service_role only

DROP POLICY IF EXISTS "Service role can upload chapter images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update chapter images" ON storage.objects;

CREATE POLICY "Service role can upload chapter images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'chapter-images');

CREATE POLICY "Service role can update chapter images"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'chapter-images');
