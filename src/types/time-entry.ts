export interface TimeEntry {
  id: string
  task_id: string
  user_id: string
  date: string
  minutes: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CreateTimeEntryInput {
  task_id: string
  user_id: string
  date: string
  minutes: number
  notes?: string | null
}
