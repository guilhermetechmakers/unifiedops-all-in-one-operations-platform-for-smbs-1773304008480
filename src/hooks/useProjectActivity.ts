import { useQuery } from '@tanstack/react-query'
import { activityApi } from '@/api/activity'

export const activityKeys = {
  project: (projectId: string, limit?: number) => ['activity', projectId, limit] as const,
}

export function useProjectActivity(projectId: string | undefined, limit = 50) {
  return useQuery({
    queryKey: activityKeys.project(projectId ?? '', limit),
    queryFn: () => activityApi.listByProject(projectId!, limit),
    enabled: !!projectId,
    staleTime: 1000 * 60,
  })
}
