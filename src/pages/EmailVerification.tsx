import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useState } from 'react'
import { toast } from 'sonner'

export default function EmailVerification() {
  const [resendCooldown, setResendCooldown] = useState(false)

  const handleResend = () => {
    if (resendCooldown) return
    setResendCooldown(true)
    toast.success('Verification email sent.')
    setTimeout(() => setResendCooldown(false), 60000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container-narrow flex-1 py-12 md:py-20 flex items-center justify-center">
        <AnimatedPage className="w-full max-w-md">
          <Card>
            <CardHeader>
              <div className="mx-auto rounded-full bg-accent/10 p-3 w-fit mb-2">
                <Mail className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-center">Verify your email</CardTitle>
              <CardDescription className="text-center">
                We’ve sent a verification link to your email. Click the link to activate your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline" onClick={handleResend} disabled={resendCooldown}>
                {resendCooldown ? 'Resend in 1 min' : 'Resend verification email'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Didn’t receive the email? Check spam or{' '}
                <Link to="/help" className="text-accent hover:underline">contact support</Link>.
              </p>
              <div className="pt-4 border-t border-border flex justify-center">
                <Link to="/login" className="text-sm font-medium text-accent hover:underline">Back to log in</Link>
              </div>
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
