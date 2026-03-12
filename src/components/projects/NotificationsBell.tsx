import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notification'

interface NotificationsBellProps {
  notifications: Notification[]
  unreadCount?: number
  onMarkRead?: (id: string) => void
  className?: string
}

export function NotificationsBell({
  notifications,
  unreadCount,
  onMarkRead,
  className,
}: NotificationsBellProps) {
  const count = unreadCount ?? (Array.isArray(notifications) ? notifications.filter((n) => !n.is_read).length : 0)
  const list = Array.isArray(notifications) ? notifications.slice(0, 10) : []

  return (
    <div className={cn('relative', className)}>
      <Button variant="ghost" size="icon" aria-label={`Notifications${count ? ` (${count} unread)` : ''}`}>
        <Bell className="h-5 w-5" />
        {count > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[1rem] rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center px-1">
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </Button>
      {list.length > 0 ? (
        <div className="absolute right-0 top-full mt-1 w-72 rounded-lg border border-border bg-card shadow-lg py-2 z-50 hidden group-hover:block">
          <div className="px-3 py-2 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Notifications</span>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {list.map((n) => (
              <li
                key={n.id}
                className={cn(
                  'px-3 py-2 text-sm hover:bg-muted/50 cursor-pointer',
                  !n.is_read && 'bg-accent/5'
                )}
                onClick={() => onMarkRead?.(n.id)}
              >
                <p className="text-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.type}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
