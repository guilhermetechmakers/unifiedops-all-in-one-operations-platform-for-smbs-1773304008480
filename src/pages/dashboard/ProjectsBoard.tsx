import { Link } from 'react-router-dom'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Plus } from 'lucide-react'

const columns = [
  { id: 'todo', title: 'To Do', tasks: [{ id: '1', title: 'Design review', project: 'Website Redesign' }] },
  { id: 'progress', title: 'In Progress', tasks: [{ id: '2', title: 'API integration', project: 'Mobile App' }] },
  { id: 'done', title: 'Done', tasks: [{ id: '3', title: 'Copy draft', project: 'Marketing' }] },
]

export default function ProjectsBoard() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur flex h-16 items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">Projects</h1>
          <Button asChild>
            <Link to="/dashboard/projects/new"><Plus className="h-4 w-4 mr-2" />New project</Link>
          </Button>
        </header>
        <div className="p-6">
          <AnimatedPage>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {columns.map((col) => (
                <div key={col.id} className="min-w-[280px] flex flex-col rounded-lg border border-border bg-muted/20 p-3">
                  <h2 className="font-semibold text-foreground mb-3">{col.title}</h2>
                  <div className="space-y-2 flex-1">
                    {col.tasks.map((task) => (
                      <Card key={task.id} className="cursor-grab">
                        <CardContent className="p-3">
                          <p className="font-medium text-sm text-foreground">{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
