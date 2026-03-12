import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectFilesApi } from '@/api/project-files'
import { toast } from 'sonner'

export const projectFileKeys = {
  project: (projectId: string, taskId?: string | null) => ['project-files', projectId, taskId] as const,
}

export function useProjectFiles(projectId: string | undefined, taskId?: string | null) {
  return useQuery({
    queryKey: projectFileKeys.project(projectId ?? '', taskId),
    queryFn: () => projectFilesApi.listByProject(projectId!, taskId),
    enabled: !!projectId,
  })
}

export function useCreateProjectFile(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { file_name: string; file_url: string; uploaded_by: string; task_id?: string | null }) =>
      projectFilesApi.create(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectFileKeys.project(projectId) })
      toast.success('File uploaded')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to upload file')
    },
  })
}

export function useDeleteProjectFile(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (fileId: string) => projectFilesApi.delete(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectFileKeys.project(projectId) })
      toast.success('File removed')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to remove file')
    },
  })
}
