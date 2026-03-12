import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Link } from 'react-router-dom'
import { Shield, Key, Smartphone, Link2 } from 'lucide-react'

const profileSchema = z.object({
  full_name: z.string().max(200).optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth()
  const [profileSaving, setProfileSaving] = useState(false)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: '' },
  })

  useEffect(() => {
    const name = profile?.full_name ?? user?.user_metadata?.full_name ?? ''
    profileForm.reset({ full_name: name })
  }, [profile?.full_name, user?.user_metadata?.full_name, profileForm])

  const onProfileSubmit = async (data: ProfileForm) => {
    if (!user || !supabase) return
    setProfileSaving(true)
    try {
      await supabase.auth.updateUser({ data: { full_name: data.full_name ?? undefined } })
      await supabase.from('profiles').update({
        full_name: data.full_name ?? null,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id)
      await refreshProfile()
      toast.success('Profile updated')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update profile')
    } finally {
      setProfileSaving(false)
    }
  }

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
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="mt-6">
                <Card className="shadow-card border-border">
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <div>
                        <Label htmlFor="settings-name">Full name</Label>
                        <Input
                          id="settings-name"
                          placeholder="Jane Doe"
                          className="mt-1"
                          {...profileForm.register('full_name')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="settings-email">Email</Label>
                        <Input
                          id="settings-email"
                          type="email"
                          value={user?.email ?? ''}
                          className="mt-1 bg-muted/50"
                          readOnly
                          disabled
                          aria-describedby="email-readonly"
                        />
                        <p id="email-readonly" className="text-xs text-muted-foreground mt-1">
                          Email is managed by your account. Change it in Security if supported.
                        </p>
                      </div>
                      <Button type="submit" disabled={profileSaving}>
                        {profileSaving ? 'Saving…' : 'Save changes'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                <p className="mt-4 text-sm text-muted-foreground">
                  <Link to="/dashboard/profile" className="text-accent hover:underline">
                    View full profile and activity
                  </Link>
                </p>
              </TabsContent>
              <TabsContent value="security" className="mt-6 space-y-6">
                <Card className="shadow-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>
                      Add an extra layer of security. Use an authenticator app or SMS (when enabled).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {profile?.two_factor_enabled
                        ? '2FA is enabled on your account.'
                        : '2FA is not yet enabled. Use an authenticator app (TOTP) or contact your admin for SMS setup.'}
                    </p>
                    <Button variant="outline" disabled>
                      {profile?.two_factor_enabled ? 'Manage 2FA' : 'Enable 2FA (coming soon)'}
                    </Button>
                  </CardContent>
                </Card>
                <Card className="shadow-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Password
                    </CardTitle>
                    <CardDescription>
                      Change your password or set one if you signed up with a social provider.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild>
                      <Link to="/password-reset">Change password</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="shadow-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Sessions
                    </CardTitle>
                    <CardDescription>
                      Your current session is active. Sign out of other devices from the app or revoke sessions (admin).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Session management and audit logs are available to admins. Sign out below to end this session.
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/dashboard">Continue to Dashboard</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="shadow-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="h-5 w-5" />
                      Connected accounts
                    </CardTitle>
                    <CardDescription>
                      Sign in with Google or Microsoft. Link or unlink OAuth providers (managed at sign-in).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Connect or disconnect accounts from the login page when signing in.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="company" className="mt-6">
                <Card className="shadow-card border-border">
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
                <Card className="shadow-card border-border">
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
                <Card className="shadow-card border-border">
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
