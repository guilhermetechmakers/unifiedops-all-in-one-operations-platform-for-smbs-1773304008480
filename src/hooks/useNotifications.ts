import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/api/notifications'

export const notificationKeys = {
  user: (userId: string) => ['notifications', userId] as const,
}

export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: notificationKeys.user(userId ?? ''),
    queryFn: () => notificationsApi.list(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: string) => notificationsApi.markRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
