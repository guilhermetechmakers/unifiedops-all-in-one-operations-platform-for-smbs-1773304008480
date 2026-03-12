export interface ProjectBillingSettings {
  id: string
  project_id: string
  billing_method: 'hourly' | 'fixed'
  rate: number | null
  currency: string
  next_billing_date: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  status: string
  organization_id: string
  owner_id: string | null
  start_date: string | null
  due_date: string | null
  billing_settings_id: string | null
  billing_settings?: ProjectBillingSettings | null
  created_at: string
  updated_at: string
}

export interface CreateProjectInput {
  name: string
  description?: string
  user_id?: string
  organization_id: string
  status?: string
  start_date?: string
  due_date?: string
  /** e.g. 'default' for default tasks (Kickoff, Requirements, ...) */
  template?: string
}

export interface UpdateProjectInput {
  id: string
  name?: string
  description?: string
  status?: string
  start_date?: string
  due_date?: string
}
