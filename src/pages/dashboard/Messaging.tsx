import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'
import { MessageSquare } from 'lucide-react'

export default function Messaging() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur h-16 flex items-center px-6">
          <h1 className="text-lg font-semibold text-foreground">Team Messaging</h1>
        </header>
        <div className="p-6">
          <AnimatedPage>
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No threads yet. Start a conversation with your team.</p>
              </CardContent>
            </Card>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
