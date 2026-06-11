-- Security hardening: prevent anonymous and authenticated users from directly executing
-- the SECURITY DEFINER trigger function via RPC. This function is only meant to be
-- called internally by database triggers during auth events.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Security hardening: remove the broad SELECT policy on storage.objects that allowed
-- anyone to list every file in the chapter-images bucket. Public images remain fully
-- accessible through their direct CDN URLs because the bucket itself is public; this
-- change only blocks programmatic enumeration of all filenames.
DROP POLICY IF EXISTS "Chapter images are publicly accessible" ON storage.objects;