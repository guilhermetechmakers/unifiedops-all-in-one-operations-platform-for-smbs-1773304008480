import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/auth'

interface AuthState {
  user: SupabaseUser | null
  session: SupabaseSession | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
  refreshSession: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getProfileFromRow(row: unknown): Profile | null {
  if (!row || typeof row !== 'object') return null
  const r = row as Record<string, unknown>
  return {
    id: String(r.id ?? ''),
    organization_id: r.organization_id != null ? String(r.organization_id) : null,
    full_name: r.full_name != null ? String(r.full_name) : null,
    avatar_url: r.avatar_url != null ? String(r.avatar_url) : null,
    role: String(r.role ?? 'member'),
    email_verified: Boolean(r.email_verified),
    two_factor_enabled: Boolean(r.two_factor_enabled),
    last_login_at: r.last_login_at != null ? String(r.last_login_at) : null,
    is_active: r.is_active !== false,
    created_at: String(r.created_at ?? ''),
    updated_at: String(r.updated_at ?? ''),
  }
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const client = supabase
  if (!client) return null
  const { data, error } = await client.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error || !data) return null
  return getProfileFromRow(data)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<SupabaseSession | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const refreshProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null)
      return
    }
    const p = await fetchProfile(user.id)
    setProfile(p)
  }, [user?.id])

  const refreshSession = useCallback(async () => {
    const client = supabase
    if (!client) {
      setSession(null)
      setUser(null)
      setProfile(null)
      setIsLoading(false)
      setIsInitialized(true)
      return
    }
    const { data } = await client.auth.getSession()
    setSession(data.session)
    setUser(data.session?.user ?? null)
    if (data.session?.user?.id) {
      const p = await fetchProfile(data.session.user.id)
      setProfile(p)
    } else {
      setProfile(null)
    }
    setIsLoading(false)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    const client = supabase
    if (!client) {
      setIsLoading(false)
      setIsInitialized(true)
      return
    }
    refreshSession()
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user?.id) {
        fetchProfile(session.user.id).then(setProfile)
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [refreshSession])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const client = supabase
      if (!client) return { error: new Error('Auth not configured') }
      const { error } = await client.auth.signInWithPassword({ email, password })
      return { error: error ?? null }
    },
    []
  )

  const signUp = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const client = supabase
      if (!client) return { error: new Error('Auth not configured') }
      const { error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: fullName ? { full_name: fullName } : undefined,
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-email`,
        },
      })
      return { error: error ?? null }
    },
    []
  )

  const signOut = useCallback(async () => {
    const client = supabase
    if (client) await client.auth.signOut()
    setSession(null)
    setUser(null)
    setProfile(null)
  }, [])

  const resetPassword = useCallback(
    async (email: string) => {
      const client = supabase
      if (!client) return { error: new Error('Auth not configured') }
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/password-reset`,
      })
      return { error: error ?? null }
    },
    []
  )

  const updatePassword = useCallback(
    async (newPassword: string) => {
      const client = supabase
      if (!client) return { error: new Error('Auth not configured') }
      const { error } = await client.auth.updateUser({ password: newPassword })
      return { error: error ?? null }
    },
    []
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      isLoading,
      isInitialized,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      refreshSession,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      isLoading,
      isInitialized,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      refreshSession,
      refreshProfile,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useOptionalAuth(): AuthContextValue | null {
  return useContext(AuthContext)
}
