import { useParams, Link } from 'react-router-dom'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KanbanBoard } from '@/components/projects/KanbanBoard'
import { MilestoneList } from '@/components/projects/MilestoneList'
import { TimeTracker } from '@/components/projects/TimeTracker'
import { ActivityLogPanel } from '@/components/projects/ActivityLogPanel'
import { FileList } from '@/components/projects/FileList'
import { TeamPanel } from '@/components/projects/TeamPanel'
import { TimelineView } from '@/components/projects/TimelineView'
import { useProject } from '@/hooks/useProjects'
import { useBoard } from '@/hooks/useBoard'
import { useMilestones, useUpdateMilestone, useCompleteMilestone } from '@/hooks/useMilestones'
import { useProjectActivity } from '@/hooks/useProjectActivity'
import { useProjectFiles, useDeleteProjectFile } from '@/hooks/useProjectFiles'
import { useTimeEntriesByProject, useCreateTimeEntry } from '@/hooks/useTimeEntries'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import type { Task } from '@/types/task'
import type { Milestone } from '@/types/milestone'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const projectId = id ?? ''
  const auth = useAuth()
  const userId = auth?.user?.id ?? ''

  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId)
  const { data: boardData = [] } = useBoard(projectId)
  const allTasks = (boardData ?? []).flatMap((s) => s.tasks ?? [])
  const { data: milestones = [], isLoading: milestonesLoading } = useMilestones(projectId)
  const { data: activities = [], isLoading: activitiesLoading } = useProjectActivity(projectId)
  const { data: files = [], isLoading: filesLoading } = useProjectFiles(projectId)
  const { data: timeEntries = [] } = useTimeEntriesByProject(projectId)
  const updateMilestone = useUpdateMilestone(projectId)
  const completeMilestone = useCompleteMilestone(projectId)
  const createTimeEntry = useCreateTimeEntry(projectId)
  const deleteFile = useDeleteProjectFile(projectId)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const selectedTaskMinutes =
    selectedTask != null
      ? (timeEntries ?? []).filter((e) => e.task_id === selectedTask.id).reduce((sum, e) => sum + (e.minutes ?? 0), 0)
      : 0

  if (projectError) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <p className="text-destructive">{projectError.message}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/dashboard/projects">Back to projects</Link>
          </Button>
        </main>
      </div>
    )
  }

  if (projectLoading || !project) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-32 w-full" />
        </main>
      </div>
    )
  }

  const handleLogTime = (minutes: number, notes?: string) => {
    if (!selectedTask || !userId) return
    createTimeEntry.mutate({
      task_id: selectedTask.id,
      user_id: userId,
      date: new Date().toISOString().slice(0, 10),
      minutes,
      notes,
    })
    setSelectedTask(null)
  }

  const handleCompleteMilestone = (m: Milestone) => {
    if (m.completed) {
      updateMilestone.mutate({ milestoneId: m.id, completed: false })
    } else {
      completeMilestone.mutate(m.id)
    }
  }

  const teamMembers = project ? [{ id: project.owner_id ?? project.id, full_name: 'Owner', role: 'owner' }] : []

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard/projects">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold text-foreground">{project.name}</h1>
          </div>
          <Button asChild>
            <Link to="/dashboard/projects">Board</Link>
          </Button>
        </header>
        <div className="p-6">
          <AnimatedPage>
            <Tabs defaultValue="board" className="space-y-4">
              <TabsList>
                <TabsTrigger value="board">Board</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="board" className="space-y-4">
                <KanbanBoard
                  projectId={projectId}
                  onTaskClick={(task) => setSelectedTask(task)}
                />
              </TabsContent>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {project.description || 'No description.'}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TimelineView
                          milestones={milestones}
                          tasks={allTasks}
                          startDate={project.start_date}
                          endDate={project.due_date}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Team</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TeamPanel members={teamMembers} />
                      </CardContent>
                    </Card>
                    {selectedTask ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Log time – {selectedTask.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <TimeTracker
                            taskId={selectedTask.id}
                            totalMinutes={selectedTaskMinutes}
                            onLog={handleLogTime}
                            isLoading={createTimeEntry.isPending}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => setSelectedTask(null)}
                          >
                            Close
                          </Button>
                        </CardContent>
                      </Card>
                    ) : null}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="milestones" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MilestoneList
                      milestones={milestones}
                      onComplete={handleCompleteMilestone}
                      isLoading={milestonesLoading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="files" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileList
                      files={files}
                      onDelete={(f) => deleteFile.mutate(f.id)}
                      isLoading={filesLoading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActivityLogPanel
                      activities={activities}
                      isLoading={activitiesLoading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
