export interface ProjectActivityLog {
  id: string
  project_id: string
  entity_type: string
  entity_id: string | null
  action: string
  actor_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}
