import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, CheckCircle, XCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

type VerificationState = 'pending' | 'success' | 'failure'

export default function EmailVerification() {
  const navigate = useNavigate()
  const { user, refreshSession } = useAuth()
  const [state, setState] = useState<VerificationState>('pending')
  const [resendCooldown, setResendCooldown] = useState(false)

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const type = params.get('type')
    const hasToken = params.get('access_token') || params.get('token')
    if (hasToken && (type === 'signup' || type === 'email')) {
      setState('success')
      refreshSession()
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', window.location.pathname)
      }
    } else if (user?.email_confirmed_at) {
      setState('success')
    }
  }, [user?.email_confirmed_at, refreshSession])

  useEffect(() => {
    if (state !== 'success') return
    const t = setTimeout(() => navigate('/dashboard', { replace: true }), 2000)
    return () => clearTimeout(t)
  }, [state, navigate])

  const handleResend = async () => {
    if (resendCooldown) return
    const client = supabase
    if (!client) {
      toast.error('Unable to resend. Try signing up again with the same email.')
      return
    }
    setResendCooldown(true)
    const { error } = await client.auth.resend({ type: 'signup' })
    if (error) {
      toast.error(error.message ?? 'Failed to resend. Try signing up again with the same email.')
    } else {
      toast.success('Verification email sent.')
    }
    setTimeout(() => setResendCooldown(false), 60000)
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="container-narrow flex-1 py-12 md:py-20 flex items-center justify-center">
          <AnimatedPage className="w-full max-w-md text-center">
            <Card className="shadow-card border-border">
              <CardHeader>
                <div className="mx-auto rounded-full bg-success/10 p-3 w-fit mb-2">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-foreground">Email verified</CardTitle>
                <CardDescription>
                  Your email has been confirmed. Redirecting you to the dashboard…
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </AnimatedPage>
        </main>
        <Footer />
      </div>
    )
  }

  if (state === 'failure') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="container-narrow flex-1 py-12 md:py-20 flex items-center justify-center">
          <AnimatedPage className="w-full max-w-md">
            <Card className="shadow-card border-border">
              <CardHeader>
                <div className="mx-auto rounded-full bg-destructive/10 p-3 w-fit mb-2">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-foreground">Verification failed</CardTitle>
                <CardDescription>
                  The link may be expired or invalid. Request a new verification email or try signing up again.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleResend} disabled={resendCooldown}>
                  {resendCooldown ? 'Resend in 1 min' : 'Resend verification email'}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">Back to log in</Link>
                </Button>
              </CardContent>
            </Card>
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
              <div className="mx-auto rounded-full bg-accent/10 p-3 w-fit mb-2">
                <Mail className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-foreground">Verify your email</CardTitle>
              <CardDescription>
                We’ve sent a verification link to your email. Click the link to activate your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                variant="outline"
                onClick={handleResend}
                disabled={resendCooldown}
              >
                {resendCooldown ? 'Resend in 1 min' : 'Resend verification email'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Didn’t receive the email? Check spam or{' '}
                <Link to="/help" className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                  contact support
                </Link>.
              </p>
              <div className="pt-4 border-t border-border flex justify-center">
                <Link
                  to="/login"
                  className="text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  Back to log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
