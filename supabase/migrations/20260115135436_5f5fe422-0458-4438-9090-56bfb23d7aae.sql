-- Add missing columns to notice_board
ALTER TABLE public.notice_board ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE public.notice_board ADD COLUMN IF NOT EXISTS link_url TEXT;

-- Add missing columns to submissions
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS external_link TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS submitter_name TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS submitter_email TEXT;

-- Create get_like_count function for reactions
CREATE OR REPLACE FUNCTION public.get_like_count(p_entity_type TEXT, p_entity_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.reactions
  WHERE entity_type = p_entity_type 
    AND entity_id = p_entity_id 
    AND reaction = 'like'
$$;

-- Create get_dislike_count function for reactions
CREATE OR REPLACE FUNCTION public.get_dislike_count(p_entity_type TEXT, p_entity_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.reactions
  WHERE entity_type = p_entity_type 
    AND entity_id = p_entity_id 
    AND reaction = 'dislike'
$$;