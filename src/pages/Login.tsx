import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { AnimatedPage } from '@/components/AnimatedPage'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  full_name: z.string().optional(),
})

type LoginForm = z.infer<typeof loginSchema>
type SignupForm = z.infer<typeof signupSchema>

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', full_name: '' },
  })

  const onLogin = async (_data: LoginForm) => {
    setLoading(true)
    try {
      // Placeholder: call auth API or Supabase
      if (_data.remember && typeof localStorage !== 'undefined') {
        localStorage.setItem('auth_token', 'demo-token')
      }
      toast.success('Signed in successfully')
      navigate('/dashboard')
    } catch {
      toast.error('Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const onSignup = async (_data: SignupForm) => {
    setLoading(true)
    try {
      // Placeholder: call auth API or Supabase
      toast.success('Account created. Check your email to verify.')
      navigate('/login')
    } catch {
      toast.error('Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container-narrow flex-1 py-12 md:py-20 flex items-center justify-center">
        <AnimatedPage className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Log in or create an account to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Log in</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="mt-6">
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" placeholder="you@company.com" className="mt-1" {...loginForm.register('email')} />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input id="login-password" type="password" className="mt-1" {...loginForm.register('password')} />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1">{loginForm.formState.errors.password.message}</p>
                      )}
                      <Link to="/password-reset" className="text-sm text-accent hover:underline mt-1 block">Forgot password?</Link>
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" {...loginForm.register('remember')} className="rounded border-input" />
                      <span className="text-sm">Remember me</span>
                    </label>
                    <Button type="submit" className="w-full" disabled={loading}>Log in</Button>
                  </form>
                </TabsContent>
                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name">Full name (optional)</Label>
                      <Input id="signup-name" placeholder="Jane Doe" className="mt-1" {...signupForm.register('full_name')} />
                    </div>
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="you@company.com" className="mt-1" {...signupForm.register('email')} />
                      {signupForm.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" type="password" placeholder="Min 8 characters" className="mt-1" {...signupForm.register('password')} />
                      {signupForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1">{signupForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>Create account</Button>
                  </form>
                </TabsContent>
              </Tabs>
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase text-muted-foreground"><span className="bg-card px-2">Or continue with</span></div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" disabled>Google (coming soon)</Button>
                <Button type="button" variant="outline" disabled>Microsoft (coming soon)</Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
