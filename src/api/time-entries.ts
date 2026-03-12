import { supabase } from '@/lib/supabase'
import type { TimeEntry, CreateTimeEntryInput } from '@/types/time-entry'

function getClient() {
  if (!supabase) throw new Error('Supabase not configured')
  return supabase
}

export const timeEntriesApi = {
  async listByProject(projectId: string): Promise<TimeEntry[]> {
    const client = getClient()
    const { data: tasks } = await client.from('tasks').select('id').eq('project_id', projectId)
    const taskIds = (tasks ?? []).map((t) => t.id)
    if (taskIds.length === 0) return []
    const { data, error } = await client
      .from('time_entries')
      .select('*')
      .in('task_id', taskIds)
      .order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as TimeEntry[]
  },

  async listByTask(taskId: string): Promise<TimeEntry[]> {
    const client = getClient()
    const { data, error } = await client
      .from('time_entries')
      .select('*')
      .eq('task_id', taskId)
      .order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as TimeEntry[]
  },

  async create(input: CreateTimeEntryInput): Promise<TimeEntry> {
    const client = getClient()
    const { data, error } = await client
      .from('time_entries')
      .insert({
        task_id: input.task_id,
        user_id: input.user_id,
        date: input.date,
        minutes: Math.max(0, input.minutes),
        notes: input.notes ?? null,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as TimeEntry
  },
}
