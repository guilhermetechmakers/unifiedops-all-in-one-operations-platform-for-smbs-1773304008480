import { supabase } from '@/lib/supabase'
import type { Swimlane, CreateSwimlaneInput } from '@/types/swimlane'

function getClient() {
  if (!supabase) throw new Error('Supabase not configured')
  return supabase
}

const SWIMLANE_NAMES = ['Backlog', 'In Progress', 'Review', 'Done']

export const swimlanesApi = {
  async listByProject(projectId: string): Promise<Swimlane[]> {
    const client = getClient()
    const { data, error } = await client
      .from('swimlanes')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []) as Swimlane[]
  },

  async create(input: CreateSwimlaneInput): Promise<Swimlane> {
    const client = getClient()
    const { data, error } = await client
      .from('swimlanes')
      .insert({
        project_id: input.project_id,
        name: input.name,
        position: input.position ?? 0,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as Swimlane
  },

  async createDefaultsForProject(projectId: string): Promise<Swimlane[]> {
    const client = getClient()
    const rows = SWIMLANE_NAMES.map((name, i) => ({ project_id: projectId, name, position: i }))
    const { data, error } = await client.from('swimlanes').insert(rows).select()
    if (error) throw new Error(error.message)
    return (data ?? []) as Swimlane[]
  },

  async reorder(projectId: string, swimlaneIds: string[]): Promise<void> {
    const client = getClient()
    const updates = swimlaneIds.map((id, position) => ({ id, position }))
    await Promise.all(
      updates.map(({ id, position }) =>
        client.from('swimlanes').update({ position, updated_at: new Date().toISOString() }).eq('id', id).eq('project_id', projectId)
      )
    )
  },
}
