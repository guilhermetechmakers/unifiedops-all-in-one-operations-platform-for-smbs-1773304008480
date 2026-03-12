import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { User, Mail, Shield, Activity } from 'lucide-react'

const profileSchema = z.object({
  full_name: z.string().max(200).optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function UserProfile() {
  const { user, profile, refreshProfile } = useAuth()
  const [saving, setSaving] = useState(false)

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: '' },
  })

  useEffect(() => {
    const name = profile?.full_name ?? user?.user_metadata?.full_name ?? ''
    form.reset({ full_name: name })
  }, [profile?.full_name, user?.user_metadata?.full_name, form])

  const onSubmit = async (data: ProfileForm) => {
    const client = supabase
    if (!client || !user) return
    setSaving(true)
    try {
      const { error: updateError } = await client.auth.updateUser({
        data: { full_name: data.full_name ?? undefined },
      })
      if (updateError) throw updateError
      await client.from('profiles').update({
        full_name: data.full_name ?? null,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id)
      await refreshProfile()
      toast.success('Profile updated')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const email = user?.email ?? ''
  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? email.split('@')[0]
  const initial = displayName ? displayName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur h-16 flex items-center px-6">
          <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        </header>
        <div className="p-6">
          <AnimatedPage className="max-w-2xl space-y-6">
            <Card className="shadow-card border-border">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div
                    className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center text-xl font-semibold text-accent"
                    aria-hidden
                  >
                    {initial}
                  </div>
                  <div>
                    <CardTitle className="text-foreground">{displayName}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-0.5">
                      <Mail className="h-3.5 w-3.5" />
                      {email}
                    </CardDescription>
                    {profile?.role && (
                      <Badge variant="secondary" className="mt-2">
                        {profile.role}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="profile-full_name">Full name</Label>
                    <Input
                      id="profile-full_name"
                      placeholder="Your name"
                      className="mt-1"
                      {...form.register('full_name')}
                    />
                    {form.formState.errors.full_name && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {form.formState.errors.full_name.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity
                </CardTitle>
                <CardDescription>
                  Recent account activity. Full audit log is available in Settings → Security.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You’re signed in. Manage security and sessions in{' '}
                  <Link to="/dashboard/settings" className="text-accent hover:underline">
                    Settings
                  </Link>.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Two-factor authentication and password. Configure in Settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link to="/dashboard/settings">Open Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
