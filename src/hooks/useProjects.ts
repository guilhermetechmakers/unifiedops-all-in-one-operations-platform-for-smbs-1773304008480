import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/api/projects'
import { swimlanesApi } from '@/api/swimlanes'
import { tasksApi } from '@/api/tasks'
import { toast } from 'sonner'
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project'

export const projectKeys = {
  all: ['projects'] as const,
  lists: (filter?: { status?: string }) => [...projectKeys.all, 'list', filter] as const,
  list: (id: string) => [...projectKeys.all, 'detail', id] as const,
}

const DEFAULT_TEMPLATE_TASKS = [
  'Kickoff',
  'Requirements',
  'Design',
  'Build',
  'QA',
  'Deploy',
]

export function useProjects(filter?: { status?: string }) {
  return useQuery({
    queryKey: projectKeys.lists(filter),
    queryFn: () => projectsApi.list(filter),
    staleTime: 1000 * 60 * 2,
  })
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: projectKeys.list(id ?? ''),
    queryFn: () => projectsApi.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const project = await projectsApi.create(input)
      const swimlanes = await swimlanesApi.createDefaultsForProject(project.id)
      const firstSwimlaneId = swimlanes[0]?.id
      if (firstSwimlaneId && input.template === 'default') {
        for (let i = 0; i < DEFAULT_TEMPLATE_TASKS.length; i++) {
          await tasksApi.create({
            project_id: project.id,
            swimlane_id: firstSwimlaneId,
            title: DEFAULT_TEMPLATE_TASKS[i],
            position: i,
          })
        }
      }
      return project
    },
    onSuccess: (project: Project) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.setQueryData(projectKeys.list(project.id), project)
      toast.success('Project created successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to create project')
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...updates }: UpdateProjectInput) => projectsApi.update(id, updates),
    onSuccess: (project: Project) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      queryClient.setQueryData(projectKeys.list(project.id), project)
      toast.success('Project updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update project')
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      toast.success('Project deleted')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete project')
    },
  })
}
