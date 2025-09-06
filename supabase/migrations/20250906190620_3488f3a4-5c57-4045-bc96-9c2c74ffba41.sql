-- Clean up unnecessary data and remove avatar-related columns
ALTER TABLE public.profiles DROP COLUMN IF EXISTS avatar_url;

-- Remove any orphaned or problematic records
DELETE FROM public.feedback WHERE user_id IS NULL;
DELETE FROM public.reactions WHERE user_id IS NULL;
DELETE FROM public.submissions WHERE status IS NULL;

-- Clean up storage bucket for avatars since we're removing profile pictures
DELETE FROM storage.objects WHERE bucket_id = 'avatars';
DELETE FROM storage.buckets WHERE id = 'avatars';