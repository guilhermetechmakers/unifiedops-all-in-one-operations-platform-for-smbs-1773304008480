import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container-narrow flex-1 py-12 md:py-16">
        <AnimatedPage>
          <h1 className="text-3xl font-bold text-foreground">About UnifiedOps</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            We built UnifiedOps because small and medium businesses were juggling too many tools. Our mission is to give you one platform for CRM, projects, finance, documents, and team messaging—so you can focus on growing your business.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/signup">Start free trial</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help">Help & FAQ</Link>
            </Button>
          </div>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
