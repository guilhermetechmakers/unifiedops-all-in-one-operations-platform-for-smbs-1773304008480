export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  project_id: string
  swimlane_id: string
  title: string
  description: string | null
  assignee_id: string | null
  status: string
  priority: TaskPriority
  estimate_hours: number
  time_spent_hours: number
  due_date: string | null
  position: number
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  project_id: string
  swimlane_id: string
  title: string
  description?: string
  assignee_id?: string | null
  status?: string
  priority?: TaskPriority
  estimate_hours?: number
  due_date?: string | null
  position?: number
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  assignee_id?: string | null
  status?: string
  priority?: TaskPriority
  estimate_hours?: number
  due_date?: string | null
  position?: number
}

export interface MoveTaskInput {
  swimlane_id: string
  position: number
}
