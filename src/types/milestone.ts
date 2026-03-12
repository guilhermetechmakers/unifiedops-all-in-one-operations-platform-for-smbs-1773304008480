export interface Milestone {
  id: string
  project_id: string
  title: string
  due_date: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

export interface CreateMilestoneInput {
  project_id: string
  title: string
  due_date?: string | null
}

export interface UpdateMilestoneInput {
  title?: string
  due_date?: string | null
  completed?: boolean
}
