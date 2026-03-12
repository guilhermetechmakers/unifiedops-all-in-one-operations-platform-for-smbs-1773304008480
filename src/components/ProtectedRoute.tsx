import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Wraps dashboard and other protected routes. Redirects to /login if not authenticated.
 * Shows nothing (or a minimal loader) while auth is initializing.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, isInitialized } = useAuth()
  const location = useLocation()

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" aria-busy="true" aria-live="polite">
        <div className="h-8 w-8 animate-[spin_1s_linear_infinite] rounded-full border-2 border-border border-t-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
