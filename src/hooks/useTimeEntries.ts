import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { timeEntriesApi } from '@/api/time-entries'
import { toast } from 'sonner'
import type { CreateTimeEntryInput } from '@/types/time-entry'
import { projectKeys } from './useProjects'
import { boardKeys } from './useBoard'

export const timeEntryKeys = {
  project: (projectId: string) => ['time-entries', 'project', projectId] as const,
  task: (taskId: string) => ['time-entries', 'task', taskId] as const,
}

export function useTimeEntriesByProject(projectId: string | undefined) {
  return useQuery({
    queryKey: timeEntryKeys.project(projectId ?? ''),
    queryFn: () => timeEntriesApi.listByProject(projectId!),
    enabled: !!projectId,
  })
}

export function useTimeEntriesByTask(taskId: string | undefined) {
  return useQuery({
    queryKey: timeEntryKeys.task(taskId ?? ''),
    queryFn: () => timeEntriesApi.listByTask(taskId!),
    enabled: !!taskId,
  })
}

export function useCreateTimeEntry(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTimeEntryInput) => timeEntriesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeEntryKeys.project(projectId) })
      queryClient.invalidateQueries({ queryKey: boardKeys.project(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.list(projectId) })
      toast.success('Time logged')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to log time')
    },
  })
}
