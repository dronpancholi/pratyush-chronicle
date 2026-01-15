-- 1. Create app_role enum for RBAC
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'contributor', 'president', 'viewer');

-- 2. Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  department TEXT,
  semester INTEGER,
  avatar_url TEXT,
  department_id UUID REFERENCES public.departments(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 5. Create newsletters table
CREATE TABLE public.newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  issue_date DATE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  pdf_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 6. Create issues table
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  title TEXT NOT NULL,
  global_pdf_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(year, month)
);

-- 7. Create department_issues table
CREATE TABLE public.department_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE NOT NULL,
  summary TEXT,
  pdf_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(issue_id, department_id)
);

-- 8. Create submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  student_name TEXT NOT NULL,
  email TEXT,
  department TEXT,
  semester INTEGER,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  media_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Create feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Create reactions table
CREATE TABLE public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  reaction TEXT NOT NULL CHECK (reaction IN ('like', 'dislike')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);

-- 11. Create notice_board table
CREATE TABLE public.notice_board (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 12. Create subscribers table
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  department TEXT,
  semester INTEGER,
  confirmed BOOLEAN DEFAULT false,
  confirm_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_board ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 14. Create security definer function to check roles
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

-- 15. Create helper function to get user's primary role
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

-- 16. Create function to get current user's role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role(auth.uid());
$$;

-- 17. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 18. Create trigger for new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 19. Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON public.newsletters FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_department_issues_updated_at BEFORE UPDATE ON public.department_issues FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_notice_board_updated_at BEFORE UPDATE ON public.notice_board FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 20. RLS Policies for departments (public read)
CREATE POLICY "Departments are viewable by everyone" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 21. RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 22. RLS Policies for user_roles
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 23. RLS Policies for newsletters
CREATE POLICY "Published newsletters are viewable by everyone" ON public.newsletters FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage newsletters" ON public.newsletters FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'president'));

-- 24. RLS Policies for issues
CREATE POLICY "Published issues are viewable by everyone" ON public.issues FOR SELECT USING (published_at IS NOT NULL);
CREATE POLICY "Admins can view all issues" ON public.issues FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'president'));
CREATE POLICY "Admins can manage issues" ON public.issues FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'president'));

-- 25. RLS Policies for department_issues
CREATE POLICY "Published department issues viewable by everyone" ON public.department_issues FOR SELECT USING (published_at IS NOT NULL);
CREATE POLICY "Admins can view all department issues" ON public.department_issues FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'president'));
CREATE POLICY "Contributors can manage own department issues" ON public.department_issues FOR ALL TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'president') OR
  public.has_role(auth.uid(), 'contributor')
);

-- 26. RLS Policies for submissions
CREATE POLICY "Anyone can create submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Approved submissions are viewable by everyone" ON public.submissions FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view own submissions" ON public.submissions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all submissions" ON public.submissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'president'));

-- 27. RLS Policies for feedback
CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view feedback" ON public.feedback FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 28. RLS Policies for reactions
CREATE POLICY "Users can manage own reactions" ON public.reactions FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view reactions" ON public.reactions FOR SELECT USING (true);

-- 29. RLS Policies for notice_board
CREATE POLICY "Active notices viewable by everyone" ON public.notice_board FOR SELECT USING (
  published_at <= now() AND (expires_at IS NULL OR expires_at > now())
);
CREATE POLICY "Admins can manage notices" ON public.notice_board FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'president'));

-- 30. RLS Policies for subscribers
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Subscribers can update own confirmation" ON public.subscribers FOR UPDATE USING (true);

-- 31. Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('newsletters', 'newsletters', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('department-newsletters', 'department-newsletters', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- 32. Storage policies for newsletters bucket
CREATE POLICY "Newsletter files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'newsletters');
CREATE POLICY "Admins can upload newsletters" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'newsletters' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'president'))
);
CREATE POLICY "Admins can update newsletters" ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'newsletters' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'president'))
);

-- 33. Storage policies for department-newsletters bucket
CREATE POLICY "Department newsletter files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'department-newsletters');
CREATE POLICY "Contributors can upload department newsletters" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'department-newsletters' AND (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'president') OR 
    public.has_role(auth.uid(), 'contributor')
  )
);
CREATE POLICY "Contributors can update department newsletters" ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'department-newsletters' AND (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'president') OR 
    public.has_role(auth.uid(), 'contributor')
  )
);

-- 34. Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 35. Seed initial departments
INSERT INTO public.departments (name, short_name, description) VALUES
  ('Computer Science & Engineering', 'CSE', 'Department of Computer Science and Engineering'),
  ('Electronics & Communication Engineering', 'ECE', 'Department of Electronics and Communication Engineering'),
  ('Electrical Engineering', 'EE', 'Department of Electrical Engineering'),
  ('Mechanical Engineering', 'ME', 'Department of Mechanical Engineering'),
  ('Civil Engineering', 'CE', 'Department of Civil Engineering'),
  ('Information Technology', 'IT', 'Department of Information Technology'),
  ('Applied Sciences', 'AS', 'Department of Applied Sciences');