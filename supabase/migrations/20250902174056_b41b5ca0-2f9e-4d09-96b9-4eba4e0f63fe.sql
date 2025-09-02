-- Extend profiles table with new fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS semester integer,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create reactions table
CREATE TABLE IF NOT EXISTS public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  reaction TEXT NOT NULL CHECK (reaction IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);

-- Enable RLS on reactions
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- Create notice_board table
CREATE TABLE IF NOT EXISTS public.notice_board (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link_url TEXT,
  pinned BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on notice_board
ALTER TABLE public.notice_board ENABLE ROW LEVEL SECURITY;

-- Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  department TEXT NOT NULL,
  semester INTEGER,
  confirmed BOOLEAN DEFAULT false,
  confirm_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  department TEXT NOT NULL,
  semester INTEGER,
  media_url TEXT,
  external_link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitter_name TEXT NOT NULL,
  submitter_email TEXT,
  moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions-media', 'submissions-media', true) ON CONFLICT DO NOTHING;

-- Create function to get current user role (avoiding RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create function to get like count
CREATE OR REPLACE FUNCTION public.get_like_count(entity_type_param TEXT, entity_id_param UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.reactions 
  WHERE entity_type = entity_type_param 
  AND entity_id = entity_id_param 
  AND reaction = 'like';
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create RLS policies for feedback
CREATE POLICY "Anyone can insert feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all feedback" ON public.feedback
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update feedback" ON public.feedback
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete feedback" ON public.feedback
  FOR DELETE USING (public.get_current_user_role() = 'admin');

-- Create RLS policies for reactions
CREATE POLICY "Users can manage their own reactions" ON public.reactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view reaction counts" ON public.reactions
  FOR SELECT USING (true);

-- Create RLS policies for notice_board
CREATE POLICY "Anyone can view published notices" ON public.notice_board
  FOR SELECT USING (
    published_at <= now() AND 
    (expires_at IS NULL OR expires_at > now())
  );

CREATE POLICY "Admins can manage notices" ON public.notice_board
  FOR ALL USING (public.get_current_user_role() IN ('admin', 'editor'));

-- Create RLS policies for subscribers
CREATE POLICY "Anyone can subscribe" ON public.subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON public.subscribers
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage subscribers" ON public.subscribers
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Create RLS policies for submissions
CREATE POLICY "Anyone can submit" ON public.submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view approved submissions" ON public.submissions
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Admins can manage all submissions" ON public.submissions
  FOR ALL USING (public.get_current_user_role() IN ('admin', 'editor'));

-- Create storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for submissions media
CREATE POLICY "Submission media is publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'submissions-media');

CREATE POLICY "Anyone can upload submission media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'submissions-media');

-- Create triggers for updated_at columns
CREATE TRIGGER update_reactions_updated_at
  BEFORE UPDATE ON public.reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notice_board_updated_at
  BEFORE UPDATE ON public.notice_board
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();