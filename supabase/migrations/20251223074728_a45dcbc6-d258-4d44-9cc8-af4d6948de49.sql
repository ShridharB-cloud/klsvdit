-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'mentor', 'student');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  usn TEXT, -- University Seat Number for students
  department TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (security best practice - separate from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create academic_years table
CREATE TABLE public.academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_name TEXT NOT NULL, -- e.g., "2024-25"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_groups table
CREATE TABLE public.project_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id TEXT NOT NULL UNIQUE, -- e.g., "GRP-2024-001"
  project_title TEXT NOT NULL,
  project_description TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE SET NULL,
  mentor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'delayed', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group_members table (students in groups)
CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.project_groups(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_leader BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (group_id, student_id)
);

-- Create project_phases table
CREATE TABLE public.project_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_number INTEGER NOT NULL CHECK (phase_number BETWEEN 1 AND 5), -- 1-4 + External Review
  phase_name TEXT NOT NULL,
  description TEXT,
  completion_percentage INTEGER NOT NULL,
  start_date DATE,
  end_date DATE,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group_phase_status table (tracks each group's progress per phase)
CREATE TABLE public.group_phase_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.project_groups(id) ON DELETE CASCADE NOT NULL,
  phase_id UUID REFERENCES public.project_phases(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'needs_revision')),
  submission_date TIMESTAMP WITH TIME ZONE,
  mentor_remarks TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (group_id, phase_id)
);

-- Create project_diary table (weekly logs)
CREATE TABLE public.project_diary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.project_groups(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  work_done TEXT NOT NULL,
  issues_faced TEXT,
  next_plan TEXT,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_reviewed BOOLEAN DEFAULT false,
  mentor_comments TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.project_groups(id) ON DELETE CASCADE NOT NULL,
  phase_id UUID REFERENCES public.project_phases(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('synopsis', 'srs', 'design', 'ppt', 'report', 'certificate', 'other')),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  version INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meetings table
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.project_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  meeting_type TEXT DEFAULT 'mentor' CHECK (meeting_type IN ('mentor', 'review', 'external', 'general')),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create external_evaluations table
CREATE TABLE public.external_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.project_groups(id) ON DELETE CASCADE NOT NULL,
  evaluator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  evaluator_name TEXT,
  evaluator_designation TEXT,
  marks INTEGER CHECK (marks >= 0 AND marks <= 100),
  remarks TEXT,
  evaluated_at TIMESTAMP WITH TIME ZONE,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'deadline', 'feedback')),
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_phase_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's group IDs
CREATE OR REPLACE FUNCTION public.get_user_group_ids(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT group_id FROM public.group_members WHERE student_id = _user_id
  UNION
  SELECT id FROM public.project_groups WHERE mentor_id = _user_id
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for academic_years
CREATE POLICY "Anyone can view academic years" ON public.academic_years FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage academic years" ON public.academic_years FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for departments
CREATE POLICY "Anyone can view departments" ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for project_groups
CREATE POLICY "Users can view their groups" ON public.project_groups FOR SELECT TO authenticated 
  USING (
    id IN (SELECT public.get_user_group_ids(auth.uid()))
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Admins can manage all groups" ON public.project_groups FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Mentors can update assigned groups" ON public.project_groups FOR UPDATE TO authenticated USING (mentor_id = auth.uid());

-- RLS Policies for group_members
CREATE POLICY "Users can view group members" ON public.group_members FOR SELECT TO authenticated 
  USING (
    group_id IN (SELECT public.get_user_group_ids(auth.uid()))
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Admins can manage group members" ON public.group_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for project_phases
CREATE POLICY "Anyone can view phases" ON public.project_phases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage phases" ON public.project_phases FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for group_phase_status
CREATE POLICY "Users can view their group phase status" ON public.group_phase_status FOR SELECT TO authenticated 
  USING (
    group_id IN (SELECT public.get_user_group_ids(auth.uid()))
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Students can update own group phase status" ON public.group_phase_status FOR UPDATE TO authenticated 
  USING (group_id IN (SELECT group_id FROM public.group_members WHERE student_id = auth.uid()));
CREATE POLICY "Mentors can update assigned group phase status" ON public.group_phase_status FOR UPDATE TO authenticated 
  USING (group_id IN (SELECT id FROM public.project_groups WHERE mentor_id = auth.uid()));
CREATE POLICY "Admins can manage phase status" ON public.group_phase_status FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for project_diary
CREATE POLICY "Users can view their group diary" ON public.project_diary FOR SELECT TO authenticated 
  USING (
    group_id IN (SELECT public.get_user_group_ids(auth.uid()))
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Students can insert diary entries" ON public.project_diary FOR INSERT TO authenticated 
  WITH CHECK (group_id IN (SELECT group_id FROM public.group_members WHERE student_id = auth.uid()));
CREATE POLICY "Students can update unreviewed entries" ON public.project_diary FOR UPDATE TO authenticated 
  USING (
    group_id IN (SELECT group_id FROM public.group_members WHERE student_id = auth.uid())
    AND is_reviewed = false
  );
CREATE POLICY "Mentors can update diary for review" ON public.project_diary FOR UPDATE TO authenticated 
  USING (group_id IN (SELECT id FROM public.project_groups WHERE mentor_id = auth.uid()));

-- RLS Policies for documents
CREATE POLICY "Users can view their group documents" ON public.documents FOR SELECT TO authenticated 
  USING (
    group_id IN (SELECT public.get_user_group_ids(auth.uid()))
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Students can upload documents" ON public.documents FOR INSERT TO authenticated 
  WITH CHECK (group_id IN (SELECT group_id FROM public.group_members WHERE student_id = auth.uid()));
CREATE POLICY "Admins can manage documents" ON public.documents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for meetings
CREATE POLICY "Users can view their meetings" ON public.meetings FOR SELECT TO authenticated 
  USING (
    group_id IN (SELECT public.get_user_group_ids(auth.uid()))
    OR group_id IS NULL
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Admins and mentors can manage meetings" ON public.meetings FOR ALL TO authenticated 
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'mentor')
  );

-- RLS Policies for external_evaluations
CREATE POLICY "Users can view their group evaluations" ON public.external_evaluations FOR SELECT TO authenticated 
  USING (
    group_id IN (SELECT public.get_user_group_ids(auth.uid()))
    OR public.has_role(auth.uid(), 'admin')
    OR evaluator_id = auth.uid()
  );
CREATE POLICY "Evaluators can update their evaluations" ON public.external_evaluations FOR UPDATE TO authenticated 
  USING (evaluator_id = auth.uid() AND is_locked = false);
CREATE POLICY "Admins can manage evaluations" ON public.external_evaluations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_groups_updated_at BEFORE UPDATE ON public.project_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_group_phase_status_updated_at BEFORE UPDATE ON public.group_phase_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_diary_updated_at BEFORE UPDATE ON public.project_diary FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default departments
INSERT INTO public.departments (name, code) VALUES
  ('Computer Science & Engineering', 'CSE'),
  ('Electronics & Communication Engineering', 'ECE'),
  ('Mechanical Engineering', 'ME'),
  ('Civil Engineering', 'CE'),
  ('Information Science & Engineering', 'ISE');

-- Insert default academic year
INSERT INTO public.academic_years (year_name, start_date, end_date, is_active) VALUES
  ('2024-25', '2024-08-01', '2025-07-31', true);

-- Insert default project phases
INSERT INTO public.project_phases (phase_number, phase_name, description, completion_percentage, academic_year_id)
SELECT 
  phase_number,
  phase_name,
  description,
  completion_percentage,
  (SELECT id FROM public.academic_years WHERE is_active = true LIMIT 1)
FROM (VALUES
  (1, 'Phase 1 - Problem Definition', 'Problem identification, literature survey, and synopsis submission', 25),
  (2, 'Phase 2 - Design & Planning', 'System design, SRS documentation, and architecture planning', 50),
  (3, 'Phase 3 - Implementation', 'Core development, coding, and initial testing', 75),
  (4, 'Phase 4 - Testing & Documentation', 'Complete testing, final documentation, and project report', 100),
  (5, 'External Review', 'Final evaluation by external examiner', 100)
) AS phases(phase_number, phase_name, description, completion_percentage);