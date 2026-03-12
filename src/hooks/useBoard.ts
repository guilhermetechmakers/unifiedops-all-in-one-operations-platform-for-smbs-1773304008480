import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { boardApi } from '@/api/board'
import { tasksApi } from '@/api/tasks'
import { toast } from 'sonner'
import type { BoardSwimlane, BoardFilters } from '@/types/board'
import type { MoveTaskInput } from '@/types/task'

export const boardKeys = {
  all: ['board'] as const,
  project: (projectId: string, filters?: BoardFilters) => [...boardKeys.all, projectId, filters] as const,
}

export function useBoard(projectId: string | undefined, filters?: BoardFilters) {
  return useQuery({
    queryKey: boardKeys.project(projectId ?? '', filters),
    queryFn: () => boardApi.getBoard(projectId!, filters),
    enabled: !!projectId,
    staleTime: 1000 * 60,
  })
}

export function useMoveTask(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, ...input }: { taskId: string } & MoveTaskInput) =>
      tasksApi.move(projectId, taskId, input),
    onMutate: async ({ taskId, swimlane_id, position }) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.project(projectId) })
      const prev = queryClient.getQueryData<BoardSwimlane[]>(boardKeys.project(projectId))
      if (!prev) return { prev }
      const next = prev.map((lane) => {
        if (lane.tasks.some((t) => t.id === taskId)) {
          const rest = lane.tasks.filter((t) => t.id !== taskId)
          return { ...lane, tasks: rest }
        }
        if (lane.id === swimlane_id) {
          const task = prev.flatMap((l) => l.tasks).find((t) => t.id === taskId)
          if (!task) return lane
          const inserted = { ...task, swimlane_id, position }
          const tasks = [...lane.tasks]
          tasks.splice(position, 0, inserted)
          return { ...lane, tasks }
        }
        return lane
      })
      queryClient.setQueryData(boardKeys.project(projectId), next)
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(boardKeys.project(projectId), ctx.prev)
      toast.error('Failed to move task')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.project(projectId) })
    },
  })
}
