import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '@/api/tasks'
import { toast } from 'sonner'
import type { CreateTaskInput, UpdateTaskInput } from '@/types/task'
import { boardKeys } from './useBoard'
import { projectKeys } from './useProjects'

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<CreateTaskInput, 'project_id'>) =>
      tasksApi.create({ ...input, project_id: projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.project(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.list(projectId) })
      toast.success('Task created')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to create task')
    },
  })
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, ...updates }: UpdateTaskInput & { taskId: string }) =>
      tasksApi.update(projectId, taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.project(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.list(projectId) })
      toast.success('Task updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update task')
    },
  })
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.delete(projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.project(projectId) })
      toast.success('Task deleted')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete task')
    },
  })
}
