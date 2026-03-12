import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
  className?: string
  onClick?: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-accent/15 text-accent',
  high: 'bg-amber-500/15 text-amber-600',
  urgent: 'bg-destructive/15 text-destructive',
}

export function TaskCard({ task, isDragging, className, onClick, dragHandleProps }: TaskCardProps) {
  const dueDate = task.due_date ? format(new Date(task.due_date), 'MMM d') : null
  const priorityClass = priorityColors[task.priority] ?? priorityColors.medium

  return (
    <Card
      className={cn(
        'cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-card-hover',
        isDragging && 'opacity-90 shadow-lg ring-2 ring-accent',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div
            className="shrink-0 touch-none p-0.5 rounded hover:bg-muted/50 cursor-grab active:cursor-grabbing"
            {...dragHandleProps}
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground line-clamp-2">{task.title}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className={cn('text-xs', priorityClass)}>
                {task.priority}
              </Badge>
              {task.estimate_hours > 0 ? (
                <span className="text-xs text-muted-foreground">{task.estimate_hours}h</span>
              ) : null}
              {dueDate ? (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {dueDate}
                </span>
              ) : null}
            </div>
            {task.assignee_id ? (
              <Avatar className="h-6 w-6 mt-2 border border-border">
                <AvatarFallback className="text-xs bg-accent/20 text-accent">
                  {String(task.assignee_id).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
