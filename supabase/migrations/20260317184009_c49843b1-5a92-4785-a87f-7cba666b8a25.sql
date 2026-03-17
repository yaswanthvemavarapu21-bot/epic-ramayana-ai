
-- Add image_url column to chapters
ALTER TABLE public.chapters ADD COLUMN image_url text;

-- Create storage bucket for chapter images
INSERT INTO storage.buckets (id, name, public) VALUES ('chapter-images', 'chapter-images', true);

-- Allow public read access to chapter images
CREATE POLICY "Chapter images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'chapter-images');

-- Allow service role / edge functions to upload images
CREATE POLICY "Service role can upload chapter images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chapter-images');

CREATE POLICY "Service role can update chapter images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'chapter-images');
