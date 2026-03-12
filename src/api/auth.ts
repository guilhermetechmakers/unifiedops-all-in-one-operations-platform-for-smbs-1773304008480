/**
 * Auth-related API helpers.
 * Uses Supabase client for session and profile; Edge Function for audit logging.
 */

import { supabase } from '@/lib/supabase'
import type { AuditEventType } from '@/types/auth'

const baseUrl = (import.meta as unknown as { env: { VITE_SUPABASE_URL?: string } }).env?.VITE_SUPABASE_URL
const AUDIT_LOG_URL = baseUrl ? `${baseUrl.replace(/\/$/, '')}/functions/v1/auth-audit-log` : ''

export interface AuditLogPayload {
  event_type: AuditEventType
  metadata?: Record<string, unknown>
}

/**
 * Insert an audit log entry via Edge Function (keeps RLS and server-side validation).
 * Falls back to direct insert if no Edge Function.
 */
export async function logAuditEvent(payload: AuditLogPayload): Promise<{ error: Error | null }> {
  const client = supabase
  if (!client) return { error: new Error('Supabase not configured') }
  if (!AUDIT_LOG_URL) return logAuditEventDirect(payload)
  const { data: { session } } = await client.auth.getSession()
  const token = session?.access_token
  if (!token) return { error: null }

  try {
    const res = await fetch(AUDIT_LOG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text()
      return { error: new Error(text || `Audit log failed: ${res.status}`) }
    }
    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e : new Error('Audit log failed') }
  }
}

/**
 * Insert audit log directly via Supabase (client-side). Use when Edge Function is not deployed.
 */
export async function logAuditEventDirect(payload: AuditLogPayload): Promise<{ error: Error | null }> {
  const client = supabase
  if (!client) return { error: new Error('Supabase not configured') }
  const { data: { session } } = await client.auth.getSession()
  if (!session?.user?.id) return { error: null }

  const { error } = await client.from('audit_logs').insert({
    user_id: session.user.id,
    event_type: payload.event_type,
    metadata: payload.metadata ?? {},
  })
  return { error: error ?? null }
}
