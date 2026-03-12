import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container-narrow flex-1 py-12 flex items-center justify-center">
        <AnimatedPage className="text-center">
          <p className="text-muted-foreground">Sign up is available on the Log in page. Use the Sign up tab.</p>
          <Button className="mt-4" asChild>
            <Link to="/login">Go to Log in</Link>
          </Button>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
