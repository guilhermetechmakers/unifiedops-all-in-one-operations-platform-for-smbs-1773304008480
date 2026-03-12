import { supabase } from '@/lib/supabase'
import type { ProjectActivityLog } from '@/types/activity'

function getClient() {
  if (!supabase) throw new Error('Supabase not configured')
  return supabase
}

export const activityApi = {
  async listByProject(projectId: string, limit = 50): Promise<ProjectActivityLog[]> {
    const client = getClient()
    const { data, error } = await client
      .from('project_activity_log')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw new Error(error.message)
    return (data ?? []) as ProjectActivityLog[]
  },

  async log(projectId: string, payload: { entity_type: string; entity_id?: string | null; action: string; actor_id?: string | null; metadata?: Record<string, unknown> }): Promise<void> {
    const client = getClient()
    const { error } = await client.from('project_activity_log').insert({
      project_id: projectId,
      entity_type: payload.entity_type,
      entity_id: payload.entity_id ?? null,
      action: payload.action,
      actor_id: payload.actor_id ?? null,
      metadata: payload.metadata ?? {},
    })
    if (error) throw new Error(error.message)
  },
}
