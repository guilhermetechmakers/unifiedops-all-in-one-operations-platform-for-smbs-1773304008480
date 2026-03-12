/**
 * Auth-related types for UnifiedOps.
 * Aligns with Supabase auth.users and public.profiles, audit_logs, oauth_connections.
 */

export type UserRole = 'user' | 'admin' | 'editor' | 'member'

export interface Profile {
  id: string
  organization_id: string | null
  full_name: string | null
  avatar_url: string | null
  role: string
  email_verified?: boolean
  two_factor_enabled?: boolean
  last_login_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email?: string
  user_metadata?: { full_name?: string; avatar_url?: string }
}

export interface Session {
  access_token: string
  refresh_token?: string
  expires_at?: number
  user: AuthUser
}

export interface OAuthConnection {
  id: string
  user_id: string
  provider: 'google' | 'microsoft'
  provider_account_id: string
  linked_at: string
}

export type AuditEventType =
  | 'signup'
  | 'login'
  | 'logout'
  | 'password_reset_request'
  | 'password_reset_confirm'
  | 'email_verification'
  | 'oauth_login'
  | 'oauth_link'
  | 'session_revoked'

export interface AuditLogEntry {
  id: string
  user_id: string | null
  event_type: AuditEventType
  metadata: Record<string, unknown>
  created_at: string
  ip_address: string | null
  user_agent: string | null
}

export interface SignUpInput {
  email: string
  password: string
  full_name?: string
}

export interface SignInInput {
  email: string
  password: string
  remember?: boolean
}
