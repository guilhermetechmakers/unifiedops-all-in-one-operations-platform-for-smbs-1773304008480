import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
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

const requestSchema = z.object({ email: z.string().email('Invalid email') })
const resetSchema = z.object({
  token: z.string().min(1, 'Token required'),
  password: z.string().min(8, 'At least 8 characters'),
})

type RequestForm = z.infer<typeof requestSchema>
type ResetForm = z.infer<typeof resetSchema>

export default function PasswordReset() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [sent, setSent] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  const requestForm = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: '' },
  })

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { token: token ?? '', password: '' },
  })

  const onRequest = async (_data: RequestForm) => {
    try {
      // Placeholder: call API to send reset email
      setSent(true)
      toast.success('Check your email for the reset link.')
    } catch {
      toast.error('Failed to send reset email.')
    }
  }

  const onReset = async (_data: ResetForm) => {
    try {
      // Placeholder: call API to reset password
      setResetDone(true)
      toast.success('Password updated. You can log in now.')
    } catch {
      toast.error('Failed to reset password.')
    }
  }

  if (resetDone) {
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
          <Card>
            <CardHeader>
              <CardTitle>{token ? 'Set new password' : 'Forgot password?'}</CardTitle>
              <CardDescription>
                {token
                  ? 'Enter your new password below.'
                  : 'Enter your email and we’ll send you a reset link.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {token ? (
                <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
                  <div>
                    <Label htmlFor="reset-password">New password</Label>
                    <Input id="reset-password" type="password" placeholder="Min 8 characters" className="mt-1" {...resetForm.register('password')} />
                    {resetForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1">{resetForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <input type="hidden" {...resetForm.register('token')} />
                  <Button type="submit" className="w-full">Reset password</Button>
                </form>
              ) : sent ? (
                <p className="text-muted-foreground">Check your email for the reset link. Didn’t get it? <button type="button" onClick={() => setSent(false)} className="text-accent hover:underline">Try again</button></p>
              ) : (
                <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
                  <div>
                    <Label htmlFor="reset-email">Email</Label>
                    <Input id="reset-email" type="email" placeholder="you@company.com" className="mt-1" {...requestForm.register('email')} />
                    {requestForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">{requestForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">Send reset link</Button>
                </form>
              )}
              <p className="mt-4 text-sm text-muted-foreground">
                <Link to="/login" className="text-accent hover:underline">Back to log in</Link>
              </p>
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
