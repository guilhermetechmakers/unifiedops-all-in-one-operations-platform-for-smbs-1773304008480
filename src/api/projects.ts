import { supabase } from '@/lib/supabase'
import type { Project, CreateProjectInput, UpdateProjectInput, ProjectBillingSettings } from '@/types/project'

function getClient() {
  if (!supabase) throw new Error('Supabase not configured')
  return supabase
}

export const projectsApi = {
  async list(filter?: { status?: string }): Promise<Project[]> {
    const client = getClient()
    let q = client.from('projects').select('*').order('updated_at', { ascending: false })
    if (filter?.status) q = q.eq('status', filter.status)
    const { data, error } = await q
    if (error) throw new Error(error.message)
    return (data ?? []) as Project[]
  },

  async getById(id: string): Promise<Project | null> {
    const client = getClient()
    const { data, error } = await client.from('projects').select('*').eq('id', id).maybeSingle()
    if (error) throw new Error(error.message)
    return data as Project | null
  },

  async create(input: CreateProjectInput): Promise<Project> {
    const client = getClient()
    const row = {
      name: input.name.trim(),
      description: input.description?.trim() ?? null,
      organization_id: input.organization_id,
      owner_id: input.user_id ?? null,
      status: input.status ?? 'active',
      start_date: input.start_date ?? null,
      due_date: input.due_date ?? null,
    }
    const { data, error } = await client.from('projects').insert(row).select().single()
    if (error) throw new Error(error.message)
    return data as Project
  },

  async update(id: string, updates: Omit<UpdateProjectInput, 'id'>): Promise<Project> {
    const client = getClient()
    const { data, error } = await client
      .from('projects')
      .update({
        ...(updates.name !== undefined && { name: updates.name.trim() }),
        ...(updates.description !== undefined && { description: updates.description?.trim() ?? null }),
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.start_date !== undefined && { start_date: updates.start_date }),
        ...(updates.due_date !== undefined && { due_date: updates.due_date }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as Project
  },

  async delete(id: string): Promise<void> {
    const client = getClient()
    const { error } = await client.from('projects').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },

  async getBillingSettings(projectId: string): Promise<ProjectBillingSettings | null> {
    const client = getClient()
    const { data, error } = await client
      .from('project_billing_settings')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data as ProjectBillingSettings | null
  },

  async upsertBillingSettings(
    projectId: string,
    settings: { billing_method: 'hourly' | 'fixed'; rate?: number; currency?: string; next_billing_date?: string | null }
  ): Promise<ProjectBillingSettings> {
    const client = getClient()
    const { data, error } = await client
      .from('project_billing_settings')
      .upsert(
        { project_id: projectId, ...settings, updated_at: new Date().toISOString() },
        { onConflict: 'project_id' }
      )
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as ProjectBillingSettings
  },
}
