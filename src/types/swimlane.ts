export interface Swimlane {
  id: string
  project_id: string
  name: string
  position: number
  created_at: string
  updated_at: string
}

export interface CreateSwimlaneInput {
  project_id: string
  name: string
  position?: number
}

export interface ReorderSwimlanesInput {
  swimlane_ids: string[]
}
