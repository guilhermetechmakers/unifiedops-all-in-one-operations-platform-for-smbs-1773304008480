import { supabase } from '@/lib/supabase'
import type { Notification } from '@/types/notification'

function getClient() {
  if (!supabase) throw new Error('Supabase not configured')
  return supabase
}

export const notificationsApi = {
  async list(userId: string): Promise<Notification[]> {
    const client = getClient()
    const { data, error } = await client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as Notification[]
  },

  async markRead(notificationId: string): Promise<void> {
    const client = getClient()
    const { error } = await client.from('notifications').update({ is_read: true }).eq('id', notificationId)
    if (error) throw new Error(error.message)
  },
}
