-- ============================================
-- CRITICAL SECURITY FIX: Move roles to separate table (Part 1)
-- Fix storage policies first, then migrate roles
-- ============================================

-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'contributor', 'president', 'viewer');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, role::app_role 
FROM public.profiles 
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 5. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 6. Create helper function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT 
  FROM public.user_roles 
  WHERE user_id = _user_id 
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'president' THEN 2
      WHEN 'editor' THEN 3
      WHEN 'contributor' THEN 4
      ELSE 5
    END
  LIMIT 1
$$;

-- 7. Update get_current_user_role function to use new table
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role(auth.uid());
$$;

-- 8. RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 9. DROP old storage policies that depend on profiles.role
DROP POLICY IF EXISTS "Admin and editors can upload newsletter files" ON storage.objects;
DROP POLICY IF EXISTS "Admin and editors can update newsletter files" ON storage.objects;
DROP POLICY IF EXISTS "Admin and editors can delete newsletter files" ON storage.objects;
DROP POLICY IF EXISTS "Contributors can upload to their department folder" ON storage.objects;
DROP POLICY IF EXISTS "Contributors can update their department files" ON storage.objects;

-- 10. CREATE new storage policies using has_role function
CREATE POLICY "Admin and editors can upload newsletter files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'newsletters' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admin and editors can update newsletter files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'newsletters' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admin and editors can delete newsletter files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'newsletters' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Contributors can upload to their department folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'department-newsletters' AND
  (public.has_role(auth.uid(), 'admin') OR 
   public.has_role(auth.uid(), 'contributor'))
);

CREATE POLICY "Contributors can update their department files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'department-newsletters' AND
  (public.has_role(auth.uid(), 'admin') OR 
   public.has_role(auth.uid(), 'contributor'))
);

-- 11. Update profiles RLS policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 12. Update notice_board policies
DROP POLICY IF EXISTS "Admins can manage notices" ON public.notice_board;
CREATE POLICY "Admins can manage notices"
ON public.notice_board
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'editor')
);

-- 13. Update submissions policies
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.submissions;
CREATE POLICY "Admins can manage all submissions"
ON public.submissions
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'editor')
);

-- 14. Update subscribers policies
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can manage subscribers" ON public.subscribers;

CREATE POLICY "Admins can view subscribers"
ON public.subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage subscribers"
ON public.subscribers
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 15. Update feedback policies
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can update feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can delete feedback" ON public.feedback;

CREATE POLICY "Admins can view all feedback"
ON public.feedback
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update feedback"
ON public.feedback
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete feedback"
ON public.feedback
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 16. Update newsletters policies
DROP POLICY IF EXISTS "Admin and editors can view all newsletters" ON public.newsletters;
DROP POLICY IF EXISTS "Admin and editors can insert newsletters" ON public.newsletters;
DROP POLICY IF EXISTS "Admin and editors can update newsletters" ON public.newsletters;

CREATE POLICY "Admin and editors can view all newsletters"
ON public.newsletters
FOR SELECT
TO authenticated
USING (
  is_published = true OR
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'editor')
);

CREATE POLICY "Admin and editors can insert newsletters"
ON public.newsletters
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'editor')
);

CREATE POLICY "Admin and editors can update newsletters"
ON public.newsletters
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'editor')
);

-- 17. Update issues policies
DROP POLICY IF EXISTS "Admin and President can manage all issues" ON public.issues;
CREATE POLICY "Admin and President can manage all issues"
ON public.issues
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'president')
);

-- 18. Update department_newsletters policies
DROP POLICY IF EXISTS "Admin and editors can manage department newsletters" ON public.department_newsletters;
CREATE POLICY "Admin and editors can manage department newsletters"
ON public.department_newsletters
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'editor')
);

-- 19. Update departments policies
DROP POLICY IF EXISTS "Only admins can modify departments" ON public.departments;
CREATE POLICY "Only admins can modify departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 20. Update department_issues policies
DROP POLICY IF EXISTS "Contributors can manage their department issues" ON public.department_issues;
CREATE POLICY "Contributors can manage their department issues"
ON public.department_issues
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'president') OR
  (public.has_role(auth.uid(), 'contributor') AND 
   EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND department_id = department_issues.department_id))
);

-- 21. Update handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile without role
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email
  );
  
  -- Assign default 'viewer' role in user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$;

-- 22. Now safe to remove role column from profiles
ALTER TABLE public.profiles DROP COLUMN role;