/**
 * API utilities for UnifiedOps.
 * - Auth headers for fetch (Supabase session).
 * - Edge Function invoker for server-only actions (PDF, email, reminders).
 * - Typed Supabase-based data access for invoicing (CRUD via client + RLS).
 */

import { supabase } from '@/lib/supabase'
import type {
  Invoice,
  InvoiceCustomer,
  InvoiceLineItem,
  InvoicePayment,
  InvoiceTemplate,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  RecordPaymentInput,
  Plan,
  Subscription,
  RecurringInvoice,
} from '@/types/invoicing'

const getSupabaseUrl = (): string => {
  const url = (import.meta as unknown as { env: { VITE_SUPABASE_URL?: string } }).env?.VITE_SUPABASE_URL ?? ''
  return url.replace(/\/$/, '')
}

/** Returns headers including Authorization from current Supabase session. */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const session = (await supabase?.auth.getSession())?.data?.session ?? null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  return headers
}

/** Invoke a Supabase Edge Function with JSON body. */
export async function invokeEdgeFunction<T = unknown>(
  name: string,
  body: unknown
): Promise<{ data?: T; error?: string }> {
  const base = getSupabaseUrl()
  if (!base) {
    return { error: 'Supabase URL not configured' }
  }
  const url = `${base}/functions/v1/${name}`
  const headers = await getAuthHeaders()
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: headers as Record<string, string>,
      body: JSON.stringify(body),
    })
    const text = await res.text()
    let data: T | undefined
    try {
      data = text ? (JSON.parse(text) as T) : undefined
    } catch {
      data = undefined
    }
    if (!res.ok) {
      return { error: (data as { message?: string })?.message ?? res.statusText ?? 'Request failed' }
    }
    return { data }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Network error' }
  }
}

// ---------- Invoice customers ----------

export async function fetchInvoiceCustomers(organizationId: string): Promise<InvoiceCustomer[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('invoice_customers')
    .select('*')
    .eq('organization_id', organizationId)
    .order('name')
  if (error) return []
  return (data ?? []) as InvoiceCustomer[]
}

export async function createInvoiceCustomer(
  organizationId: string,
  payload: { name: string; email: string; address?: string; locale?: string; tax_exempt?: boolean }
): Promise<{ data?: InvoiceCustomer; error?: string }> {
  if (!supabase) return { error: 'Supabase not configured' }
  const { data, error } = await supabase
    .from('invoice_customers')
    .insert({
      organization_id: organizationId,
      name: payload.name,
      email: payload.email,
      address: payload.address ?? null,
      locale: payload.locale ?? 'en',
      tax_exempt: payload.tax_exempt ?? false,
    })
    .select()
    .single()
  if (error) return { error: error.message }
  return { data: data as InvoiceCustomer }
}

// ---------- Invoice templates ----------

export async function fetchInvoiceTemplates(organizationId: string | null): Promise<InvoiceTemplate[]> {
  if (!supabase) return []
  let q = supabase.from('invoice_templates').select('*').order('name')
  if (organizationId) {
    q = q.or(`organization_id.eq.${organizationId},organization_id.is.null`)
  } else {
    q = q.is('organization_id', null)
  }
  const { data, error } = await q
  if (error) return []
  return (data ?? []).map((row) => ({
    ...row,
    default_variables: (row.default_variables ?? {}) as Record<string, string>,
  })) as InvoiceTemplate[]
}

export async function createInvoiceTemplate(
  organizationId: string | null,
  payload: { name: string; html_template: string; default_variables?: Record<string, string>; is_default?: boolean }
): Promise<{ data?: InvoiceTemplate; error?: string }> {
  if (!supabase) return { error: 'Supabase not configured' }
  const { data, error } = await supabase
    .from('invoice_templates')
    .insert({
      organization_id: organizationId,
      name: payload.name,
      html_template: payload.html_template,
      default_variables: payload.default_variables ?? {},
      is_default: payload.is_default ?? false,
    })
    .select()
    .single()
  if (error) return { error: error.message }
  return { data: data as InvoiceTemplate }
}

// ---------- Invoices ----------

export async function fetchInvoices(params: {
  organizationId: string
  status?: string
  customerId?: string
}): Promise<Invoice[]> {
  if (!supabase) return []
  let q = supabase
    .from('invoices')
    .select('*, customer:invoice_customers(*)')
    .eq('organization_id', params.organizationId)
    .order('created_at', { ascending: false })
  if (params.status) q = q.eq('status', params.status)
  if (params.customerId) q = q.eq('customer_id', params.customerId)
  const { data, error } = await q
  if (error) return []
  const list = (data ?? []) as (Invoice & { customer?: InvoiceCustomer })[]
  return list.map((inv) => ({
    ...inv,
    customer: Array.isArray(inv.customer) ? inv.customer[0] : inv.customer,
  })) as Invoice[]
}

export async function fetchInvoiceById(id: string): Promise<Invoice | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('invoices')
    .select('*, customer:invoice_customers(*), line_items:invoice_line_items(*), payments:invoice_payments(*)')
    .eq('id', id)
    .single()
  if (error || !data) return null
  const inv = data as Invoice & {
    customer?: InvoiceCustomer | InvoiceCustomer[]
    line_items?: InvoiceLineItem[]
    payments?: InvoicePayment[]
  }
  return {
    ...inv,
    customer: Array.isArray(inv.customer) ? inv.customer[0] : inv.customer,
    line_items: inv.line_items ?? [],
    payments: inv.payments ?? [],
  } as Invoice
}

function computeLineTotal(item: {
  quantity: number
  unit_price_cents: number
  tax_rate: number
  discount_cents?: number
}): number {
  const subtotal = Math.round(Number(item.quantity) * item.unit_price_cents)
  const discount = item.discount_cents ?? 0
  const afterDiscount = subtotal - discount
  const tax = Math.round((afterDiscount * Number(item.tax_rate)) / 100)
  return afterDiscount + tax
}

export async function createInvoice(organizationId: string, input: CreateInvoiceInput): Promise<{ data?: Invoice; error?: string }> {
  if (!supabase) return { error: 'Supabase not configured' }
  const lineItems = input.line_items ?? []
  const subtotal_cents = lineItems.reduce((sum, i) => {
    const sub = Math.round(Number(i.quantity) * i.unit_price_cents) - (i.discount_cents ?? 0)
    return sum + sub
  }, 0)
  const taxes_cents = lineItems.reduce((sum, i) => {
    const afterDiscount = Math.round(Number(i.quantity) * i.unit_price_cents) - (i.discount_cents ?? 0)
    return sum + Math.round((afterDiscount * Number(i.tax_rate)) / 100)
  }, 0)
  const discount_cents = lineItems.reduce((s, i) => s + (i.discount_cents ?? 0), 0)
  const total_cents = subtotal_cents + taxes_cents - discount_cents

  const { data: nextNum } = await supabase
    .from('invoices')
    .select('number')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  const lastNum = (nextNum as { number?: string } | null)?.number ?? 'INV-0000'
  const match = lastNum.match(/INV-(\d+)/)
  const next = match ? String(parseInt(match[1], 10) + 1).padStart(4, '0') : '0001'
  const number = `INV-${next}`

  const dueDate = input.due_date || new Date().toISOString().slice(0, 10)
  const { data: inv, error: invError } = await supabase
    .from('invoices')
    .insert({
      organization_id: organizationId,
      customer_id: input.customer_id,
      number,
      date: new Date().toISOString().slice(0, 10),
      due_date: dueDate,
      status: 'draft',
      subtotal_cents,
      taxes_cents,
      discount_cents,
      total_cents,
      currency: input.currency ?? 'USD',
      template_id: input.template_id ?? null,
      notes: input.notes ?? null,
      terms: input.terms ?? null,
    })
    .select()
    .single()
  if (invError || !inv) return { error: invError?.message ?? 'Failed to create invoice' }
  const invoiceId = (inv as Invoice).id

  const rows = (lineItems as InvoiceLineItem[]).map((item, idx) => ({
    invoice_id: invoiceId,
    description: item.description,
    quantity: item.quantity,
    unit_price_cents: item.unit_price_cents,
    tax_rate: item.tax_rate,
    discount_cents: item.discount_cents ?? 0,
    line_total_cents: computeLineTotal(item),
    sort_order: idx,
  }))
  if (rows.length > 0) {
    await supabase.from('invoice_line_items').insert(rows)
  }
  return { data: await fetchInvoiceById(invoiceId) ?? (inv as Invoice) }
}

export async function updateInvoice(
  id: string,
  input: UpdateInvoiceInput
): Promise<{ data?: Invoice; error?: string }> {
  if (!supabase) return { error: 'Supabase not configured' }
  const updates: Record<string, unknown> = {}
  if (input.due_date != null) updates.due_date = input.due_date
  if (input.status != null) updates.status = input.status
  if (input.notes != null) updates.notes = input.notes
  if (input.terms != null) updates.terms = input.terms
  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from('invoices').update(updates).eq('id', id)
    if (error) return { error: error.message }
  }
  if (input.line_items != null) {
    const existing = await supabase.from('invoice_line_items').select('id').eq('invoice_id', id)
    const ids = (existing.data ?? []).map((r) => r.id)
    if (ids.length > 0) {
      await supabase.from('invoice_line_items').delete().eq('invoice_id', id)
    }
    const items = input.line_items as InvoiceLineItem[]
    if (items.length > 0) {
      const rows = items.map((item, idx) => ({
        invoice_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price_cents: item.unit_price_cents,
        tax_rate: item.tax_rate,
        discount_cents: item.discount_cents ?? 0,
        line_total_cents: computeLineTotal(item),
        sort_order: idx,
      }))
      const { error } = await supabase.from('invoice_line_items').insert(rows)
      if (error) return { error: error.message }
    }
  }
  const updated = await fetchInvoiceById(id)
  return updated ? { data: updated } : { error: 'Invoice not found' }
}

export async function recordPayment(invoiceId: string, input: RecordPaymentInput): Promise<{ data?: InvoicePayment; error?: string }> {
  if (!supabase) return { error: 'Supabase not configured' }
  const { data, error } = await supabase
    .from('invoice_payments')
    .insert({
      invoice_id: invoiceId,
      date: input.date,
      amount_cents: input.amount_cents,
      method: input.method,
      transaction_id: input.transaction_id ?? null,
      status: 'completed',
    })
    .select()
    .single()
  if (error) return { error: error.message }
  return { data: data as InvoicePayment }
}

/** Trigger send-invoice email (Edge Function). */
export async function sendInvoiceEmail(
  invoiceId: string,
  payload: { recipients: string[]; locale?: string; payment_terms?: string; method?: string }
): Promise<{ error?: string }> {
  const { error } = await invokeEdgeFunction('send-invoice-email', { invoice_id: invoiceId, ...payload })
  return { error }
}

/** Trigger reminder (Edge Function). */
export async function remindInvoice(invoiceId: string): Promise<{ error?: string }> {
  const { error } = await invokeEdgeFunction('invoice-remind', { invoice_id: invoiceId })
  return { error }
}

/** Request invoice HTML/PDF from Edge Function. Returns HTML blob URL for preview; client can print to PDF. */
export async function getInvoicePdfUrl(invoiceId: string): Promise<{ url?: string; html?: string; error?: string }> {
  const res = await invokeEdgeFunction<{ url?: string; pdf_base64?: string; html?: string }>('render-invoice-pdf', { invoice_id: invoiceId })
  if (res.error) return { error: res.error }
  if (res.data?.url) return { url: res.data.url }
  if (res.data?.pdf_base64) {
    try {
      const bin = atob(res.data.pdf_base64)
      const arr = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
      const blob = new Blob([arr], { type: 'application/pdf' })
      return { url: URL.createObjectURL(blob) }
    } catch {
      return { error: 'Invalid PDF response' }
    }
  }
  if (res.data?.html) {
    const blob = new Blob([res.data.html], { type: 'text/html;charset=utf-8' })
    return { url: URL.createObjectURL(blob), html: res.data.html }
  }
  return { error: 'No PDF or HTML returned' }
}

// ---------- Plans & Subscriptions ----------

export async function fetchPlans(): Promise<Plan[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('plans').select('*').order('price_cents')
  if (error) return []
  return (data ?? []).map((r) => ({ ...r, features: Array.isArray(r.features) ? r.features : [] })) as Plan[]
}

export async function fetchSubscription(organizationId: string): Promise<Subscription | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, plan:plans(*)')
    .eq('organization_id', organizationId)
    .maybeSingle()
  if (error || !data) return null
  const sub = data as Subscription & { plan?: Plan | Plan[] }
  return {
    ...sub,
    plan: Array.isArray(sub.plan) ? sub.plan[0] : sub.plan,
  } as Subscription
}

export async function updateSubscription(
  organizationId: string,
  payload: { plan_id?: string; billing_cycle?: string; payment_method_id?: string; auto_renew?: boolean }
): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        organization_id: organizationId,
        ...payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'organization_id' }
    )
  if (error) return { error: error.message }
  return {}
}
