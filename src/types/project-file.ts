export interface ProjectFile {
  id: string
  project_id: string
  task_id: string | null
  file_name: string
  file_url: string
  uploaded_by: string
  uploaded_at: string
}
