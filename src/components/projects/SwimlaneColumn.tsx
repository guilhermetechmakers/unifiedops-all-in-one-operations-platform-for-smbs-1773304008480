import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'
import type { Swimlane } from '@/types/swimlane'

interface SwimlaneColumnProps {
  swimlane: Swimlane
  tasks: Task[]
  isOver?: boolean
  renderTask: (task: Task, index: number) => React.ReactNode
  onQuickAdd?: (swimlaneId: string, title: string) => void
  className?: string
}

export function SwimlaneColumn({
  swimlane,
  tasks,
  isOver,
  renderTask,
  onQuickAdd,
  className,
}: SwimlaneColumnProps) {
  const { setNodeRef, isOver: dndIsOver } = useDroppable({ id: `swimlane-${swimlane.id}` })
  const over = isOver ?? dndIsOver
  const [quickAdd, setQuickAdd] = useState('')

  const handleQuickAdd = () => {
    const title = quickAdd.trim()
    if (title && onQuickAdd) {
      onQuickAdd(swimlane.id, title)
      setQuickAdd('')
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-w-[280px] w-[280px] flex flex-col rounded-xl border border-border bg-muted/20 p-3 transition-colors',
        over && 'ring-2 ring-accent/50 bg-accent/5',
        className
      )}
    >
      <h2 className="font-semibold text-foreground mb-3 px-1 flex items-center justify-between">
        <span>{swimlane.name}</span>
        <span className="text-xs font-normal text-muted-foreground">
          {(tasks ?? []).length}
        </span>
      </h2>
      <div className="flex-1 space-y-2 overflow-y-auto min-h-[120px]">
        {Array.isArray(tasks) ? tasks.map((task, index) => renderTask(task, index)) : null}
      </div>
      {onQuickAdd ? (
        <div className="flex gap-2 mt-2 pt-2 border-t border-border">
          <Input
            placeholder="Add task…"
            value={quickAdd}
            onChange={(e) => setQuickAdd(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            className="flex-1 text-sm"
          />
          <button
            type="button"
            onClick={handleQuickAdd}
            className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Add task"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  )
}
