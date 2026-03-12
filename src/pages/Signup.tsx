import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Signup() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container-narrow flex-1 py-12 flex items-center justify-center">
        <AnimatedPage className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-foreground">Create an account</h1>
          <p className="mt-2 text-muted-foreground">
            Sign up is available on the Log in page. Use the Sign up tab to create an account with email or continue with Google or Microsoft.
          </p>
          <Button
            className="mt-6"
            onClick={() => navigate('/login', { state: { tab: 'signup' } })}
          >
            Go to Log in / Sign up
          </Button>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
