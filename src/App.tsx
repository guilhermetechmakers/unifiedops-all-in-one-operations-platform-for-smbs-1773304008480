import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'

import Landing from '@/pages/Landing'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import CookiePolicy from '@/pages/CookiePolicy'
import About from '@/pages/About'
import Help from '@/pages/Help'
import NotFound from '@/pages/NotFound'
import ServerError from '@/pages/ServerError'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import PasswordReset from '@/pages/PasswordReset'
import EmailVerification from '@/pages/EmailVerification'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import CrmList from '@/pages/dashboard/CrmList'
import ProjectsBoard from '@/pages/dashboard/ProjectsBoard'
import FinanceOverview from '@/pages/dashboard/FinanceOverview'
import Documents from '@/pages/dashboard/Documents'
import Messaging from '@/pages/dashboard/Messaging'
import Analytics from '@/pages/dashboard/Analytics'
import Settings from '@/pages/dashboard/Settings'
import CreateInvoice from '@/pages/dashboard/CreateInvoice'
import CreateCustomer from '@/pages/dashboard/CreateCustomer'
import UserProfile from '@/pages/dashboard/UserProfile'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/crm" element={<ProtectedRoute><CrmList /></ProtectedRoute>} />
            <Route path="/dashboard/projects" element={<ProtectedRoute><ProjectsBoard /></ProtectedRoute>} />
            <Route path="/dashboard/finance" element={<ProtectedRoute><FinanceOverview /></ProtectedRoute>} />
            <Route path="/dashboard/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
            <Route path="/dashboard/messaging" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
            <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/dashboard/invoices/new" element={<ProtectedRoute><CreateInvoice /></ProtectedRoute>} />
            <Route path="/dashboard/crm/new" element={<ProtectedRoute><CreateCustomer /></ProtectedRoute>} />
            <Route path="/500" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}

export default App
