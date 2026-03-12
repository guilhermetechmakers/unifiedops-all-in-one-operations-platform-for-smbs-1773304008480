import { supabase } from '@/lib/supabase'
import type { BoardSwimlane, BoardFilters } from '@/types/board'
import type { Swimlane } from '@/types/swimlane'
import type { Task } from '@/types/task'

function getClient() {
  if (!supabase) throw new Error('Supabase not configured')
  return supabase
}

export const boardApi = {
  async getBoard(projectId: string, filters?: BoardFilters): Promise<BoardSwimlane[]> {
    const client = getClient()
    const { data: swimlanes, error: swimError } = await client
      .from('swimlanes')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true })
    if (swimError) throw new Error(swimError.message)
    const lanes = (swimlanes ?? []) as Swimlane[]

    let tasksQuery = client.from('tasks').select('*').eq('project_id', projectId).order('position', { ascending: true })
    if (filters?.assignee_id != null) tasksQuery = tasksQuery.eq('assignee_id', filters.assignee_id)
    if (filters?.status) tasksQuery = tasksQuery.eq('status', filters.status)
    if (filters?.priority) tasksQuery = tasksQuery.eq('priority', filters.priority)
    if (filters?.due_from) tasksQuery = tasksQuery.gte('due_date', filters.due_from)
    if (filters?.due_to) tasksQuery = tasksQuery.lte('due_date', filters.due_to)
    const { data: tasks, error: taskError } = await tasksQuery
    if (taskError) throw new Error(taskError.message)
    const taskList = (tasks ?? []) as Task[]

    return lanes.map((lane) => ({
      ...lane,
      tasks: taskList.filter((t) => t.swimlane_id === lane.id),
    }))
  },
}
