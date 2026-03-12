export interface Notification {
  id: string
  user_id: string
  type: string
  message: string
  is_read: boolean
  related_id: string | null
  created_at: string
}
