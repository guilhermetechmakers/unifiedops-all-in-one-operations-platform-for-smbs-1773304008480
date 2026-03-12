import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Milestone } from '@/types/milestone'
import { format } from 'date-fns'

interface MilestoneListProps {
  milestones: Milestone[]
  onComplete?: (milestone: Milestone) => void
  isLoading?: boolean
  className?: string
}

export function MilestoneList({ milestones, onComplete, isLoading, className }: MilestoneListProps) {
  const list = Array.isArray(milestones) ? milestones : []

  if (isLoading) {
    return (
      <ul className={cn('space-y-2', className)}>
        {[1, 2, 3].map((i) => (
          <li key={i} className="h-14 rounded-lg bg-muted/50 animate-pulse" />
        ))}
      </ul>
    )
  }

  return (
    <ul className={cn('space-y-2', className)}>
      {list.map((m) => (
        <li
          key={m.id}
          className={cn(
            'flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors',
            m.completed && 'opacity-75'
          )}
        >
          <button
            type="button"
            onClick={() => onComplete?.(m)}
            className="shrink-0 rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={m.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {m.completed ? (
              <Check className="h-5 w-5 text-[rgb(var(--success))]" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <p className={cn('font-medium text-sm text-foreground', m.completed && 'line-through text-muted-foreground')}>
              {m.title}
            </p>
            {m.due_date ? (
              <p className="text-xs text-muted-foreground mt-0.5">
                Due {format(new Date(m.due_date), 'MMM d, yyyy')}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
