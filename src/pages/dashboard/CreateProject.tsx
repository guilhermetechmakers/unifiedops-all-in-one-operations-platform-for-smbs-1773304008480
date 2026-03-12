import { useNavigate } from 'react-router-dom'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { ProjectForm, type ProjectFormValues } from '@/components/projects/ProjectForm'
import { useCreateProject } from '@/hooks/useProjects'
import { useAuth } from '@/contexts/AuthContext'

export default function CreateProject() {
  const navigate = useNavigate()
  const auth = useAuth()
  const createProject = useCreateProject()
  const organizationId = auth?.profile?.organization_id ?? ''
  const userId = auth?.user?.id ?? ''

  const handleSubmit = (values: ProjectFormValues) => {
    if (!organizationId) {
      return
    }
    createProject.mutate(
      {
        name: values.name,
        description: values.description,
        organization_id: organizationId,
        user_id: userId,
        start_date: values.start_date || undefined,
        due_date: values.due_date || undefined,
        template: values.template === 'default' ? 'default' : undefined,
      },
      {
        onSuccess: (project) => {
          navigate(`/dashboard/projects/${project.id}`)
        },
      }
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur flex h-16 items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">New project</h1>
        </header>
        <div className="p-6 max-w-2xl">
          <AnimatedPage>
            {organizationId ? (
              <ProjectForm
                onSubmit={handleSubmit}
                isLoading={createProject.isPending}
              />
            ) : (
              <p className="text-muted-foreground">You need to belong to an organization to create a project.</p>
            )}
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
