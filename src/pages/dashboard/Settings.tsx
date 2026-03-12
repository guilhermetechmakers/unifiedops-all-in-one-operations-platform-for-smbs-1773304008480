import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Settings() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur h-16 flex items-center px-6">
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        </header>
        <div className="p-6">
          <AnimatedPage>
            <Tabs defaultValue="profile">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" placeholder="Jane Doe" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="you@company.com" className="mt-1" />
                    </div>
                    <Button>Save changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="company" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company</CardTitle>
                    <CardDescription>Company branding and details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Company name</Label>
                      <Input id="company-name" placeholder="Acme Inc." className="mt-1" />
                    </div>
                    <Button>Save</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="integrations" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                    <CardDescription>Connect Stripe, Plaid, and more.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Configure in your dashboard or during onboarding.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Email and in-app notification preferences.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Choose what you want to be notified about.</p>
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
