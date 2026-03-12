import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <AnimatedPage className="text-center max-w-md">
        <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto" />
        <h1 className="mt-6 text-3xl font-bold text-foreground">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">Landing</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/help">Help</Link>
          </Button>
        </div>
        <div className="mt-8">
          <label className="sr-only" htmlFor="404-search">Search</label>
          <Input id="404-search" placeholder="Search..." className="max-w-xs mx-auto" />
        </div>
      </AnimatedPage>
    </div>
  )
}
