import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project } from '@/types/project'
import { format } from 'date-fns'

interface ProjectCardProps {
  project: Project
  className?: string
}

function progressFromProject(_project: Project): number {
  return 0
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const progress = progressFromProject(project)
  const dueDate = project.due_date ? format(new Date(project.due_date), 'MMM d, yyyy') : null

  return (
    <Link to={`/dashboard/projects/${project.id}`}>
      <Card
        className={cn(
          'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover animate-fade-in-up',
          className
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-1">{project.name}</h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {project.status}
            </Badge>
          </div>
          {project.description ? (
            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{project.description}</p>
          ) : null}
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            {dueDate ? (
              <>
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>{dueDate}</span>
              </>
            ) : null}
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
