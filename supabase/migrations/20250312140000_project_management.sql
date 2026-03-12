-- Project Management schema (idempotent)
-- Extends projects; adds swimlanes, tasks, milestones, time_entries, activity_log, comments, files, billing, notifications.

-- Add columns to projects if not present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'owner_id') THEN
    ALTER TABLE public.projects ADD COLUMN owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'start_date') THEN
    ALTER TABLE public.projects ADD COLUMN start_date DATE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'due_date') THEN
    ALTER TABLE public.projects ADD COLUMN due_date DATE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'billing_settings_id') THEN
    ALTER TABLE public.projects ADD COLUMN billing_settings_id UUID;
  END IF;
END $$;

-- Project billing settings
CREATE TABLE IF NOT EXISTS public.project_billing_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  billing_method TEXT NOT NULL DEFAULT 'hourly' CHECK (billing_method IN ('hourly', 'fixed')),
  rate DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  next_billing_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id)
);

ALTER TABLE public.project_billing_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project billing: org access" ON public.project_billing_settings
  FOR ALL USING (
    project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()))
  );

-- FK from projects to billing_settings (optional; add after project_billing_settings exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_schema = 'public' AND table_name = 'projects' AND constraint_name = 'projects_billing_settings_id_fkey') THEN
    ALTER TABLE public.projects ADD CONSTRAINT projects_billing_settings_id_fkey
      FOREIGN KEY (billing_settings_id) REFERENCES public.project_billing_settings(id) ON DELETE SET NULL;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Swimlanes
CREATE TABLE IF NOT EXISTS public.swimlanes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_swimlanes_project_id ON public.swimlanes(project_id);
ALTER TABLE public.swimlanes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Swimlanes: org access" ON public.swimlanes
  FOR ALL USING (
    project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()))
  );

-- Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  swimlane_id UUID NOT NULL REFERENCES public.swimlanes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  estimate_hours DECIMAL(10,2) DEFAULT 0,
  time_spent_hours DECIMAL(10,2) DEFAULT 0,
  due_date DATE,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_swimlane_id ON public.tasks(swimlane_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tasks: org access" ON public.tasks
  FOR ALL USING (
    project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()))
  );

-- Milestones
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON public.milestones(project_id);
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Milestones: org access" ON public.milestones
  FOR ALL USING (
    project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()))
  );

-- Time entries
CREATE TABLE IF NOT EXISTS public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  minutes INT NOT NULL DEFAULT 0 CHECK (minutes >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON public.time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON public.time_entries(user_id);
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Time entries: org access" ON public.time_entries
  FOR ALL USING (
    task_id IN (SELECT id FROM public.tasks WHERE project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())))
  );

-- Activity log (project-scoped)
CREATE TABLE IF NOT EXISTS public.project_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_activity_log_project_id ON public.project_activity_log(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activity_log_created_at ON public.project_activity_log(created_at DESC);
ALTER TABLE public.project_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project activity: org access" ON public.project_activity_log
  FOR ALL USING (
    project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()))
  );

-- Comments (task or project)
CREATE TABLE IF NOT EXISTS public.project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_type TEXT NOT NULL CHECK (parent_type IN ('task', 'project')),
  parent_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_comments_parent ON public.project_comments(parent_type, parent_id);
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments: org access" ON public.project_comments
  FOR ALL USING (
    (parent_type = 'project' AND parent_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())))
    OR
    (parent_type = 'task' AND parent_id IN (SELECT id FROM public.tasks WHERE project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()))))
  );

-- Project files
CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON public.project_files(project_id);
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project files: org access" ON public.project_files
  FOR ALL USING (
    project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()))
  );

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications: own only" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Project members (for team panel; optional many-to-many)
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members: org access" ON public.project_members
  FOR ALL USING (
    project_id IN (SELECT id FROM public.projects WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()))
  );
