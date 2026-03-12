import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Folder, FileText, Upload } from 'lucide-react'

export default function Documents() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur flex h-16 items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">Documents</h1>
          <Button><Upload className="h-4 w-4 mr-2" />Upload</Button>
        </header>
        <div className="p-6">
          <AnimatedPage>
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Folder className="h-4 w-4" /> All files
              </div>
            </div>
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents yet. Upload contracts, proposals, or other files.</p>
                <Button className="mt-4">Upload file</Button>
              </CardContent>
            </Card>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
