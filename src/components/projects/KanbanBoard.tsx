import { useState, useCallback } from 'react'
import { useCreateTask } from '@/hooks/useTasks'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { TaskCard } from './TaskCard'
import { SwimlaneColumn } from './SwimlaneColumn'
import { useBoard, useMoveTask } from '@/hooks/useBoard'
import type { Task } from '@/types/task'
import { cn } from '@/lib/utils'

const TASK_PREFIX = 'task-'
const SWIMLANE_PREFIX = 'swimlane-'

function getTaskId(dragId: string): string | null {
  return dragId.startsWith(TASK_PREFIX) ? dragId.slice(TASK_PREFIX.length) : null
}

interface KanbanBoardProps {
  projectId: string
  onTaskClick?: (task: Task) => void
  className?: string
}

export function KanbanBoard({
  projectId,
  onTaskClick,
  className,
}: KanbanBoardProps) {
  const { data: swimlanes = [], isLoading, error } = useBoard(projectId)
  const moveTask = useMoveTask(projectId)
  const createTask = useCreateTask(projectId)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const handleQuickAdd = useCallback(
    (swimlaneId: string, title: string) => {
      const lane = (swimlanes ?? []).find((s) => s.id === swimlaneId)
      const position = (lane?.tasks ?? []).length
      createTask.mutate({ swimlane_id: swimlaneId, title, position })
    },
    [createTask, swimlanes]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const taskId = getTaskId(event.active.id as string)
    if (!taskId) return
    const task = swimlanes.flatMap((s) => s.tasks).find((t) => t.id === taskId)
    if (task) setActiveTask(task)
  }, [swimlanes])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null)
      const taskId = getTaskId(event.active.id as string)
      const overId = String(event.over?.id ?? '')
      if (!taskId || !overId) return
      let targetSwimlaneId: string | null = null
      if (overId.startsWith(SWIMLANE_PREFIX)) {
        targetSwimlaneId = overId.slice(SWIMLANE_PREFIX.length)
      } else if (overId.startsWith(TASK_PREFIX)) {
        const overTaskId = overId.slice(TASK_PREFIX.length)
        const lane = swimlanes.find((s) => (s.tasks ?? []).some((t) => t.id === overTaskId))
        targetSwimlaneId = lane?.id ?? null
      }
      if (!targetSwimlaneId) return
      const targetLane = swimlanes.find((s) => s.id === targetSwimlaneId)
      const targetTasks = targetLane?.tasks ?? []
      const position = targetTasks.length
      moveTask.mutate({ taskId, swimlane_id: targetSwimlaneId, position })
    },
    [swimlanes, moveTask]
  )

  if (error) {
    return (
      <div className="text-destructive text-sm p-4">
        {error.message}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[280px] w-[280px] rounded-xl border border-border bg-muted/20 p-3 animate-pulse">
            <div className="h-5 w-24 bg-muted rounded mb-3" />
            <div className="space-y-2">
              <div className="h-20 bg-muted rounded" />
              <div className="h-20 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const lanes = Array.isArray(swimlanes) ? swimlanes : []

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
        {lanes.map((lane) => (
          <SwimlaneColumn
            key={lane.id}
            swimlane={lane}
            tasks={lane.tasks ?? []}
            onQuickAdd={handleQuickAdd}
            renderTask={(task, _index) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick?.(task)}
              />
            )}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} className="w-[260px] shadow-lg" isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function DraggableTaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${TASK_PREFIX}${task.id}`,
  })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskCard
        task={task}
        isDragging={isDragging}
        onClick={onClick}
        dragHandleProps={listeners}
      />
    </div>
  )
}
