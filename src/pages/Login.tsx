import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AnimatedPage } from '@/components/AnimatedPage'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { checkPasswordStrength } from '@/lib/password'
import { supabase } from '@/lib/supabase'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  full_name: z.string().max(200).optional(),
})

type LoginForm = z.infer<typeof loginSchema>
type SignupForm = z.infer<typeof signupSchema>

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  const from = (location.state as { from?: { pathname: string }; tab?: string } | null)?.from?.pathname ?? '/dashboard'
  const initialTab = (location.state as { tab?: string } | null)?.tab ?? 'login'

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', full_name: '' },
  })

  const signupPassword = signupForm.watch('password', '')
  const strength = checkPasswordStrength(signupPassword ?? '')

  const onLogin = async (data: LoginForm) => {
    setLoading(true)
    try {
      const { error } = await signIn(data.email, data.password)
      if (error) {
        toast.error(error.message ?? 'Sign in failed')
        return
      }
      toast.success('Signed in successfully')
      navigate(from, { replace: true })
    } catch {
      toast.error('Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const onSignup = async (data: SignupForm) => {
    if (!strength.passed) {
      toast.error('Please meet all password requirements.')
      return
    }
    setLoading(true)
    try {
      const { error } = await signUp(data.email, data.password, data.full_name)
      if (error) {
        toast.error(error.message ?? 'Sign up failed')
        return
      }
      toast.success('Account created. Check your email to verify.')
      navigate('/verify-email', { replace: true })
    } catch {
      toast.error('Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'microsoft') => {
    const client = supabase
    if (!client) {
      toast.error('Sign-in not configured')
      return
    }
    setOauthLoading(provider)
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: provider === 'microsoft' ? 'azure' : 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      })
      if (error) {
        toast.error(error.message ?? `${provider} sign-in failed`)
      }
    } catch {
      toast.error(`${provider} sign-in failed`)
    } finally {
      setOauthLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container-narrow flex-1 py-12 md:py-20 flex items-center justify-center">
        <AnimatedPage className="w-full max-w-md">
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Welcome back</CardTitle>
              <CardDescription>Log in or create an account to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={initialTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Log in</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="mt-6">
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@company.com"
                        className="mt-1"
                        autoComplete="email"
                        {...loginForm.register('email')}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1" role="alert">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        className="mt-1"
                        autoComplete="current-password"
                        {...loginForm.register('password')}
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1" role="alert">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                      <Link
                        to="/password-reset"
                        className="text-sm text-accent hover:underline mt-1 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...loginForm.register('remember')}
                        className="rounded border-input h-4 w-4"
                        aria-label="Remember me"
                      />
                      <span className="text-sm text-muted-foreground">Remember me</span>
                    </label>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Signing in…' : 'Log in'}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name">Full name (optional)</Label>
                      <Input
                        id="signup-name"
                        placeholder="Jane Doe"
                        className="mt-1"
                        autoComplete="name"
                        {...signupForm.register('full_name')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@company.com"
                        className="mt-1"
                        autoComplete="email"
                        {...signupForm.register('email')}
                      />
                      {signupForm.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1" role="alert">
                          {signupForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Min 8 characters"
                        className="mt-1"
                        autoComplete="new-password"
                        {...signupForm.register('password')}
                      />
                      {signupForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1" role="alert">
                          {signupForm.formState.errors.password.message}
                        </p>
                      )}
                      <div className="mt-2">
                        <Progress value={(strength.score / 5) * 100} className="h-1.5" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Strength: <span className="font-medium">{strength.label}</span>
                        </p>
                        <ul className="mt-1 text-xs text-muted-foreground space-y-0.5">
                          {strength.checks.map((c) => (
                            <li key={c.label} className={c.ok ? 'text-success' : ''}>
                              {c.ok ? '✓' : '○'} {c.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || !strength.passed}>
                      {loading ? 'Creating account…' : 'Create account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
                  <span className="bg-card px-2">Or continue with</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuth('google')}
                  disabled={!!oauthLoading}
                >
                  {oauthLoading === 'google' ? '…' : 'Google'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuth('microsoft')}
                  disabled={!!oauthLoading}
                >
                  {oauthLoading === 'microsoft' ? '…' : 'Microsoft'}
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground text-center">
                SSO (SAML) available for teams — configure in Settings.
              </p>
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
