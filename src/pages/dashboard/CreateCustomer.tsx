import { Link } from 'react-router-dom'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function CreateCustomer() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur h-16 flex items-center px-6">
          <h1 className="text-lg font-semibold text-foreground">New contact</h1>
        </header>
        <div className="p-6">
          <AnimatedPage>
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Add contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Jane Doe" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="jane@company.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Acme Inc." className="mt-1" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button>Save & create project</Button>
                    <Button variant="outline" asChild><Link to="/dashboard/crm">Cancel</Link></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
