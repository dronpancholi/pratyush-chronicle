-- Create newsletters table for managing newsletter issues
CREATE TABLE public.newsletters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  issue_date DATE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  pdf_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create department_newsletters table for department-specific content
CREATE TABLE public.department_newsletters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  newsletter_id UUID NOT NULL REFERENCES public.newsletters(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  content TEXT,
  pdf_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(newsletter_id, department_id)
);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for newsletters
CREATE POLICY "Anyone can view published newsletters"
  ON public.newsletters FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admin and editors can view all newsletters"
  ON public.newsletters FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admin and editors can insert newsletters"
  ON public.newsletters FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admin and editors can update newsletters"
  ON public.newsletters FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- RLS Policies for departments
CREATE POLICY "Anyone can view departments"
  ON public.departments FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify departments"
  ON public.departments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for department_newsletters
CREATE POLICY "Anyone can view department newsletters for published issues"
  ON public.department_newsletters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.newsletters
      WHERE id = newsletter_id AND is_published = true
    )
  );

CREATE POLICY "Admin and editors can manage department newsletters"
  ON public.department_newsletters FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can modify profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('newsletters', 'newsletters', true);

-- Storage policies for newsletter PDFs
CREATE POLICY "Anyone can view newsletter files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'newsletters');

CREATE POLICY "Admin and editors can upload newsletter files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'newsletters' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admin and editors can update newsletter files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'newsletters' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admin and editors can delete newsletter files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'newsletters' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Insert departments data
INSERT INTO public.departments (name, slug, short_name, description, category) VALUES
  ('Administrative', 'administrative', 'Admin', 'Administrative operations and management of the institution', 'administrative'),
  ('Architecture', 'architecture', 'Arch', 'Architectural design, planning, and construction technology', 'engineering'),
  ('Automation and Robotics Engineering', 'automation-robotics', 'ARE', 'Automation systems, robotics, and control engineering', 'engineering'),
  ('Automobile Engineering', 'automobile', 'Auto', 'Automotive technology, design, and manufacturing', 'engineering'),
  ('Biomedical Engineering', 'biomedical', 'BME', 'Medical device technology and bioengineering solutions', 'engineering'),
  ('Civil Engineering', 'civil', 'Civil', 'Infrastructure development, construction, and urban planning', 'engineering'),
  ('Computer Engineering', 'computer', 'CE', 'Computer systems, software development, and digital technology', 'technology'),
  ('Electrical Engineering', 'electrical', 'EE', 'Power systems, electrical machines, and energy technology', 'engineering'),
  ('Electronics and Communication Engineering', 'electronics-communication', 'ECE', 'Electronics, telecommunications, and signal processing', 'engineering'),
  ('Information and Communication Technology', 'ict', 'ICT', 'Information systems, networking, and communication technology', 'technology'),
  ('Information Technology', 'information-technology', 'IT', 'Software development, databases, and IT infrastructure', 'technology'),
  ('Instrumentation and Control Engineering', 'instrumentation-control', 'ICE', 'Process control, measurement systems, and industrial automation', 'engineering'),
  ('Mechanical Engineering', 'mechanical', 'ME', 'Mechanical systems, thermal engineering, and manufacturing', 'engineering'),
  ('Mechanical Engineering CAD/CAM', 'mechanical-cadcam', 'ME CAD/CAM', 'Computer-aided design, manufacturing, and digital fabrication', 'engineering'),
  ('Plastic Engineering', 'plastic', 'PE', 'Polymer technology, plastic processing, and materials engineering', 'engineering'),
  ('Science and Humanities', 'science-humanities', 'S&H', 'Basic sciences, mathematics, and humanities education', 'science');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_newsletters_updated_at
  BEFORE UPDATE ON public.newsletters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_department_newsletters_updated_at
  BEFORE UPDATE ON public.department_newsletters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    'viewer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();