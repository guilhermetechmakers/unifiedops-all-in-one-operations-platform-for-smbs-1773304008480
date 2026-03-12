import { supabase } from '@/lib/supabase'
import type { Milestone, CreateMilestoneInput, UpdateMilestoneInput } from '@/types/milestone'

function getClient() {
  if (!supabase) throw new Error('Supabase not configured')
  return supabase
}

export const milestonesApi = {
  async listByProject(projectId: string): Promise<Milestone[]> {
    const client = getClient()
    const { data, error } = await client
      .from('milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true, nullsFirst: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as Milestone[]
  },

  async create(input: CreateMilestoneInput): Promise<Milestone> {
    const client = getClient()
    const { data, error } = await client
      .from('milestones')
      .insert({
        project_id: input.project_id,
        title: input.title.trim(),
        due_date: input.due_date ?? null,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as Milestone
  },

  async update(projectId: string, milestoneId: string, updates: UpdateMilestoneInput): Promise<Milestone> {
    const client = getClient()
    const payload = {
      ...(updates.title !== undefined && { title: updates.title.trim() }),
      ...(updates.due_date !== undefined && { due_date: updates.due_date }),
      ...(updates.completed !== undefined && { completed: updates.completed }),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await client
      .from('milestones')
      .update(payload)
      .eq('id', milestoneId)
      .eq('project_id', projectId)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as Milestone
  },

  async complete(projectId: string, milestoneId: string): Promise<Milestone> {
    return this.update(projectId, milestoneId, { completed: true })
  },
}
