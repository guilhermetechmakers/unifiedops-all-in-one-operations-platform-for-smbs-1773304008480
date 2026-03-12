import { History } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProjectActivityLog } from '@/types/activity'
import { formatDistanceToNow } from 'date-fns'

interface ActivityLogPanelProps {
  activities: ProjectActivityLog[]
  isLoading?: boolean
  className?: string
}

export function ActivityLogPanel({ activities, isLoading, className }: ActivityLogPanelProps) {
  const list = Array.isArray(activities) ? activities : []

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-muted/50 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <History className="h-4 w-4" />
          No activity yet
        </p>
      ) : (
        list.map((a) => (
          <div
            key={a.id}
            className="flex gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <span className="text-muted-foreground shrink-0">
              {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
            </span>
            <span className="text-foreground">
              {a.action} {a.entity_type} {a.entity_id ? `(${String(a.entity_id).slice(0, 8)}…)` : ''}
            </span>
          </div>
        ))
      )}
    </div>
  )
}
