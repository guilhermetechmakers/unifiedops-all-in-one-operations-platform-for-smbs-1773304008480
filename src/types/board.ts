import type { Swimlane } from './swimlane'
import type { Task } from './task'

export interface BoardSwimlane extends Swimlane {
  tasks: Task[]
}

export interface BoardState {
  swimlanes: BoardSwimlane[]
}

export interface BoardFilters {
  assignee_id?: string | null
  status?: string
  priority?: string
  due_from?: string
  due_to?: string
  milestone_id?: string | null
}
