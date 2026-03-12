import { Link } from 'react-router-dom'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useProjects } from '@/hooks/useProjects'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'

export default function ProjectsBoard() {
  const { data: projects = [], isLoading, error } = useProjects()

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur flex h-16 items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">Projects</h1>
          <Button asChild>
            <Link to="/dashboard/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              New project
            </Link>
          </Button>
        </header>
        <div className="p-6">
          <AnimatedPage>
            {error ? (
              <p className="text-destructive text-sm">{error.message}</p>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            ) : Array.isArray(projects) && projects.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="text-muted-foreground mb-4">No projects yet. Create one to get started.</p>
                <Button asChild>
                  <Link to="/dashboard/projects/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create project
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(projects ?? []).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
