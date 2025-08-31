-- First, drop the problematic policy to allow column type change
DROP POLICY IF EXISTS "Admin and editors can view all newsletters" ON public.newsletters;

-- Update profiles role column to TEXT (it's already TEXT but ensuring consistency)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id),
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create issues table for newsletter tracking
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  title TEXT NOT NULL,
  global_pdf_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(year, month)
);

-- Create department_issues table
CREATE TABLE IF NOT EXISTS public.department_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  summary TEXT,
  pdf_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(issue_id, department_id)
);

-- Enable RLS on new tables
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_issues ENABLE ROW LEVEL SECURITY;

-- Create storage buckets for department newsletters
INSERT INTO storage.buckets (id, name, public) 
VALUES ('department-newsletters', 'department-newsletters', true)
ON CONFLICT (id) DO NOTHING;

-- Re-create the newsletter policy that was dropped
CREATE POLICY "Admin and editors can view all newsletters" 
ON public.newsletters 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'editor')
  )
);

-- RLS Policies for issues table
CREATE POLICY "Anyone can view published issues" 
ON public.issues 
FOR SELECT 
USING (published_at IS NOT NULL);

CREATE POLICY "Admin and President can manage all issues" 
ON public.issues 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'president')
  )
);

-- RLS Policies for department_issues table
CREATE POLICY "Anyone can view published department issues" 
ON public.department_issues 
FOR SELECT 
USING (published_at IS NOT NULL);

CREATE POLICY "Contributors can manage their department issues" 
ON public.department_issues 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (
      role IN ('admin', 'president') 
      OR (role = 'contributor' AND department_id = department_issues.department_id)
    )
  )
);

-- Storage policies for department newsletters
CREATE POLICY "Anyone can view department newsletters" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'department-newsletters');

CREATE POLICY "Contributors can upload to their department folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'department-newsletters' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (
      role IN ('admin', 'president')
      OR (
        role = 'contributor' 
        AND department_id::text = (storage.foldername(name))[1]
      )
    )
  )
);

CREATE POLICY "Contributors can update their department files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'department-newsletters' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (
      role IN ('admin', 'president')
      OR (
        role = 'contributor' 
        AND department_id::text = (storage.foldername(name))[1]
      )
    )
  )
);

-- Update triggers for timestamps
CREATE TRIGGER update_issues_updated_at
BEFORE UPDATE ON public.issues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_department_issues_updated_at
BEFORE UPDATE ON public.department_issues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();