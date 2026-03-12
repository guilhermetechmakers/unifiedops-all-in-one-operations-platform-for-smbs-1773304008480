import { supabase } from '@/lib/supabase'
import type { Task, CreateTaskInput, UpdateTaskInput, MoveTaskInput } from '@/types/task'

function getClient() {
  if (!supabase) throw new Error('Supabase not configured')
  return supabase
}

export const tasksApi = {
  async listByProject(projectId: string): Promise<Task[]> {
    const client = getClient()
    const { data, error } = await client
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []) as Task[]
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const client = getClient()
    const row = {
      project_id: input.project_id,
      swimlane_id: input.swimlane_id,
      title: input.title.trim(),
      description: input.description?.trim() ?? null,
      assignee_id: input.assignee_id ?? null,
      status: input.status ?? 'todo',
      priority: input.priority ?? 'medium',
      estimate_hours: input.estimate_hours ?? 0,
      due_date: input.due_date ?? null,
      position: input.position ?? 0,
    }
    const { data, error } = await client.from('tasks').insert(row).select().single()
    if (error) throw new Error(error.message)
    return data as Task
  },

  async update(projectId: string, taskId: string, updates: UpdateTaskInput): Promise<Task> {
    const client = getClient()
    const payload: Record<string, unknown> = {
      ...(updates.title !== undefined && { title: updates.title.trim() }),
      ...(updates.description !== undefined && { description: updates.description?.trim() ?? null }),
      ...(updates.assignee_id !== undefined && { assignee_id: updates.assignee_id }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.priority !== undefined && { priority: updates.priority }),
      ...(updates.estimate_hours !== undefined && { estimate_hours: updates.estimate_hours }),
      ...(updates.due_date !== undefined && { due_date: updates.due_date }),
      ...(updates.position !== undefined && { position: updates.position }),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await client
      .from('tasks')
      .update(payload)
      .eq('id', taskId)
      .eq('project_id', projectId)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as Task
  },

  async move(projectId: string, taskId: string, input: MoveTaskInput): Promise<Task> {
    const client = getClient()
    const { data, error } = await client
      .from('tasks')
      .update({
        swimlane_id: input.swimlane_id,
        position: input.position,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .eq('project_id', projectId)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as Task
  },

  async delete(projectId: string, taskId: string): Promise<void> {
    const client = getClient()
    const { error } = await client.from('tasks').delete().eq('id', taskId).eq('project_id', projectId)
    if (error) throw new Error(error.message)
  },
}
