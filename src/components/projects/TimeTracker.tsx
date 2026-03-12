import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimeTrackerProps {
  taskId: string
  totalMinutes?: number
  onLog: (minutes: number, notes?: string) => void
  isLoading?: boolean
  className?: string
}

export function TimeTracker({
  taskId,
  totalMinutes = 0,
  onLog,
  isLoading = false,
  className,
}: TimeTrackerProps) {
  const [minutes, setMinutes] = useState(15)
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (minutes <= 0) return
    onLog(minutes, notes.trim() || undefined)
    setNotes('')
  }

  const hours = Math.floor((totalMinutes ?? 0) / 60)
  const mins = (totalMinutes ?? 0) % 60
  const display = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

  return (
    <div className={cn('rounded-lg border border-border bg-muted/20 p-4', className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Clock className="h-4 w-4" />
        <span>Time logged: {display}</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor={`time-min-${taskId}`}>Minutes</Label>
          <Input
            id={`time-min-${taskId}`}
            type="number"
            min={1}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`time-notes-${taskId}`}>Notes (optional)</Label>
          <Input
            id={`time-notes-${taskId}`}
            placeholder="What did you work on?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <Button type="submit" size="sm" disabled={isLoading || minutes <= 0}>
          {isLoading ? 'Logging…' : 'Log time'}
        </Button>
      </form>
    </div>
  )
}
