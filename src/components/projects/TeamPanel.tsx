import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Member {
  id: string
  full_name?: string | null
  avatar_url?: string | null
  role?: string
}

interface TeamPanelProps {
  members: Member[]
  className?: string
}

export function TeamPanel({ members, className }: TeamPanelProps) {
  const list = Array.isArray(members) ? members : []

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Users className="h-4 w-4" />
        Team
      </h3>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No members added yet.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((m) => (
            <li key={m.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="text-xs bg-accent/20 text-accent">
                  {m.full_name ? m.full_name.slice(0, 2).toUpperCase() : String(m.id).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {m.full_name ?? 'Unnamed'}
                </p>
                {m.role ? (
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
