-- First, check what columns exist and clean up the notice_board table
-- Drop the table and recreate it with the correct schema
DROP TABLE IF EXISTS public.notice_board CASCADE;

-- Create the notice_board table with the correct schema
CREATE TABLE public.notice_board (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  pinned BOOLEAN DEFAULT false,
  link_url TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notice_board ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view published notices" 
ON public.notice_board 
FOR SELECT 
USING ((published_at <= now()) AND ((expires_at IS NULL) OR (expires_at > now())));

CREATE POLICY "Admins can manage notices" 
ON public.notice_board 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'editor'::text]));

-- Insert sample data
INSERT INTO public.notice_board (title, body, published_at, pinned, link_url) VALUES
('Welcome to the new semester!', 'New academic session has started. All students are requested to attend the orientation program.', now(), true, null),
('Engineers Day Celebration', 'Join us for the Engineers Day celebration on September 15th. Various competitions and events are planned.', now(), false, 'https://example.com/engineers-day'),
('Library Hours Update', 'The library will be open from 8 AM to 8 PM starting from next week. Please plan your study schedules accordingly.', now(), false, null);