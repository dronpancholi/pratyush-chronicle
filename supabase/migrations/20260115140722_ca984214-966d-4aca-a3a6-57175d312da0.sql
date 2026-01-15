-- Create submissions-media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions-media', 'submissions-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for submissions-media
CREATE POLICY "Anyone can upload submission media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'submissions-media');

CREATE POLICY "Submission media is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'submissions-media');

CREATE POLICY "Admins can delete submission media"
ON storage.objects FOR DELETE
USING (bucket_id = 'submissions-media' AND (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'president')
));

-- Update submissions policy to include president role
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.submissions;
CREATE POLICY "Admins can manage all submissions"
ON public.submissions
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'president')
);