import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function ServerError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <AnimatedPage className="text-center max-w-md">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
        <h1 className="mt-6 text-3xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          We’re sorry. An error occurred on our side. Please try again.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Error code: 500</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button onClick={() => window.location.reload()}>Retry</Button>
          <Button variant="outline" asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Link to="/help" className="text-sm font-medium text-accent hover:underline flex items-center">
            Contact support
          </Link>
        </div>
      </AnimatedPage>
    </div>
  )
}
