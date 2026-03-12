import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { checkPasswordStrength } from '@/lib/password'

const requestSchema = z.object({ email: z.string().email('Invalid email') })
const resetSchema = z.object({
  password: z.string().min(8, 'At least 8 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: 'Passwords must match', path: ['confirm'] })

type RequestForm = z.infer<typeof requestSchema>
type ResetForm = z.infer<typeof resetSchema>

type ResetState = 'request' | 'sent' | 'confirm' | 'success' | 'error'

export default function PasswordReset() {
  const [state, setState] = useState<ResetState>('request')
  const { resetPassword, updatePassword } = useAuth()

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const params = new URLSearchParams(hash.replace(/^#/, ''))
    if (params.get('type') === 'recovery') setState('confirm')
  }, [])

  const requestForm = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: '' },
  })

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirm: '' },
  })

  const resetPasswordValue = resetForm.watch('password', '')
  const strength = checkPasswordStrength(resetPasswordValue ?? '')

  const onRequest = async (data: RequestForm) => {
    try {
      const { error } = await resetPassword(data.email)
      if (error) {
        toast.error(error.message ?? 'Failed to send reset email.')
        return
      }
      setState('sent')
      toast.success('Check your email for the reset link.')
    } catch {
      toast.error('Failed to send reset email.')
    }
  }

  const onReset = async (data: ResetForm) => {
    if (!strength.passed) {
      toast.error('Please meet all password requirements.')
      return
    }
    try {
      const { error } = await updatePassword(data.password)
      if (error) {
        toast.error(error.message ?? 'Failed to update password.')
        setState('error')
        return
      }
      setState('success')
      toast.success('Password updated. You can log in now.')
    } catch {
      toast.error('Failed to update password.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="container-narrow flex-1 py-20 flex items-center justify-center">
          <AnimatedPage className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Password reset complete</h1>
            <p className="mt-2 text-muted-foreground">You can now log in with your new password.</p>
            <Button className="mt-6" asChild>
              <Link to="/login">Log in</Link>
            </Button>
          </AnimatedPage>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container-narrow flex-1 py-12 md:py-20 flex items-center justify-center">
        <AnimatedPage className="w-full max-w-md">
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                {state === 'confirm' ? 'Set new password' : 'Forgot password?'}
              </CardTitle>
              <CardDescription>
                {state === 'confirm'
                  ? 'Enter your new password below.'
                  : 'Enter your email and we’ll send you a reset link.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state === 'confirm' ? (
                <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
                  <div>
                    <Label htmlFor="reset-password">New password</Label>
                    <Input
                      id="reset-password"
                      type="password"
                      placeholder="Min 8 characters"
                      className="mt-1"
                      autoComplete="new-password"
                      {...resetForm.register('password')}
                    />
                    {resetForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {resetForm.formState.errors.password.message}
                      </p>
                    )}
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Strength: {strength.label}</p>
                      <ul className="mt-1 text-xs text-muted-foreground space-y-0.5">
                        {strength.checks.map((c) => (
                          <li key={c.label} className={c.ok ? 'text-success' : ''}>
                            {c.ok ? '✓' : '○'} {c.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reset-confirm">Confirm password</Label>
                    <Input
                      id="reset-confirm"
                      type="password"
                      placeholder="Confirm new password"
                      className="mt-1"
                      autoComplete="new-password"
                      {...resetForm.register('confirm')}
                    />
                    {resetForm.formState.errors.confirm && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {resetForm.formState.errors.confirm.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={!strength.passed}>
                    Reset password
                  </Button>
                </form>
              ) : state === 'sent' ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Check your email for the reset link. Didn’t get it?
                  </p>
                  <button
                    type="button"
                    onClick={() => setState('request')}
                    className="text-sm text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
                  <div>
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@company.com"
                      className="mt-1"
                      autoComplete="email"
                      {...requestForm.register('email')}
                    />
                    {requestForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {requestForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Send reset link
                  </Button>
                </form>
              )}
              <p className="mt-4 text-sm text-muted-foreground">
                <Link
                  to="/login"
                  className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  Back to log in
                </Link>
              </p>
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
