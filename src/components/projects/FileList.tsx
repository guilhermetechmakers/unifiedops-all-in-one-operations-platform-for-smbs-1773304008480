import { FileText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProjectFile } from '@/types/project-file'
import { format } from 'date-fns'

interface FileListProps {
  files: ProjectFile[]
  onDelete?: (file: ProjectFile) => void
  isLoading?: boolean
  className?: string
}

export function FileList({ files, onDelete, isLoading, className }: FileListProps) {
  const list = Array.isArray(files) ? files : []

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {[1, 2].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-muted/50 animate-pulse" />
        ))}
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <FileText className="h-4 w-4" />
        No files yet. Upload documents to attach to this project.
      </p>
    )
  }

  return (
    <ul className={cn('space-y-2', className)}>
      {list.map((f) => (
        <li
          key={f.id}
          className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
        >
          <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <a
              href={f.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground hover:text-accent truncate block"
            >
              {f.file_name}
            </a>
            <p className="text-xs text-muted-foreground">
              {format(new Date(f.uploaded_at), 'MMM d, yyyy')}
            </p>
          </div>
          {onDelete ? (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(f)}
              aria-label="Remove file"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
