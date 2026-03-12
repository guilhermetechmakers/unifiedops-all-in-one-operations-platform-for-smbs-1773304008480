import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { milestonesApi } from '@/api/milestones'
import { toast } from 'sonner'
import type { CreateMilestoneInput, UpdateMilestoneInput } from '@/types/milestone'
import { projectKeys } from './useProjects'

export const milestoneKeys = {
  all: ['milestones'] as const,
  project: (projectId: string) => [...milestoneKeys.all, projectId] as const,
}

export function useMilestones(projectId: string | undefined) {
  return useQuery({
    queryKey: milestoneKeys.project(projectId ?? ''),
    queryFn: () => milestonesApi.listByProject(projectId!),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateMilestone(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<CreateMilestoneInput, 'project_id'>) =>
      milestonesApi.create({ ...input, project_id: projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestoneKeys.project(projectId) })
      toast.success('Milestone created')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to create milestone')
    },
  })
}

export function useUpdateMilestone(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ milestoneId, ...updates }: UpdateMilestoneInput & { milestoneId: string }) =>
      milestonesApi.update(projectId, milestoneId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestoneKeys.project(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.list(projectId) })
      toast.success('Milestone updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update milestone')
    },
  })
}

export function useCompleteMilestone(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (milestoneId: string) => milestonesApi.complete(projectId, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestoneKeys.project(projectId) })
      toast.success('Milestone completed')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to complete milestone')
    },
  })
}
