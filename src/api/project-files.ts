import { supabase } from '@/lib/supabase'
import type { ProjectFile } from '@/types/project-file'

function getClient() {
  if (!supabase) throw new Error('Supabase not configured')
  return supabase
}

export const projectFilesApi = {
  async listByProject(projectId: string, taskId?: string | null): Promise<ProjectFile[]> {
    const client = getClient()
    let q = client.from('project_files').select('*').eq('project_id', projectId)
    if (taskId != null) q = q.eq('task_id', taskId)
    const { data, error } = await q.order('uploaded_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as ProjectFile[]
  },

  async create(projectId: string, payload: { file_name: string; file_url: string; uploaded_by: string; task_id?: string | null }): Promise<ProjectFile> {
    const client = getClient()
    const { data, error } = await client
      .from('project_files')
      .insert({
        project_id: projectId,
        task_id: payload.task_id ?? null,
        file_name: payload.file_name,
        file_url: payload.file_url,
        uploaded_by: payload.uploaded_by,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as ProjectFile
  },

  async delete(fileId: string): Promise<void> {
    const client = getClient()
    const { error } = await client.from('project_files').delete().eq('id', fileId)
    if (error) throw new Error(error.message)
  },
}
