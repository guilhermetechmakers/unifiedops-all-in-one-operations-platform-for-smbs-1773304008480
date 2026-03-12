import { cn } from '@/lib/utils'
import type { Milestone } from '@/types/milestone'
import type { Task } from '@/types/task'
import { format } from 'date-fns'

interface TimelineViewProps {
  milestones: Milestone[]
  tasks: Task[]
  startDate?: string | null
  endDate?: string | null
  className?: string
}

export function TimelineView({
  milestones,
  tasks,
  startDate,
  endDate,
  className,
}: TimelineViewProps) {
  const milestonesList = Array.isArray(milestones) ? milestones : []
  const tasksList = Array.isArray(tasks) ? tasks : []
  const start = startDate ? new Date(startDate) : new Date()
  const end = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)))

  const getOffset = (dateStr: string | null) => {
    if (!dateStr) return 0
    const d = new Date(dateStr)
    const elapsed = (d.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
    return Math.max(0, Math.min(100, (elapsed / totalDays) * 100))
  }

  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <h3 className="text-sm font-semibold text-foreground mb-4">Timeline</h3>
      <div className="relative h-8 w-full rounded-full bg-muted/50 overflow-hidden">
        <div className="absolute inset-0 flex">
          {milestonesList.map((m) => (
            <div
              key={m.id}
              className="absolute h-full w-1 bg-accent rounded-full top-0 transform -translate-x-1/2"
              style={{ left: `${getOffset(m.due_date)}%` }}
              title={`${m.title}${m.due_date ? ` – ${format(new Date(m.due_date), 'MMM d')}` : ''}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {milestonesList.slice(0, 5).map((m) => (
          <div key={m.id} className="flex items-center gap-2 text-sm">
            <span className={cn('shrink-0', m.completed && 'text-[rgb(var(--success))]')}>
              {m.completed ? '✓' : '○'}
            </span>
            <span className="text-foreground">{m.title}</span>
            {m.due_date ? (
              <span className="text-muted-foreground text-xs">
                {format(new Date(m.due_date), 'MMM d')}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      {tasksList.length > 0 ? (
        <p className="text-xs text-muted-foreground mt-3">
          {tasksList.length} task(s) on board
        </p>
      ) : null}
    </div>
  )
}
