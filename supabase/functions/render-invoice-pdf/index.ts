/**
 * Renders an invoice to HTML/PDF.
 * Invoked by the client with invoice_id. Fetches invoice + customer + line items from Supabase,
 * applies template placeholders, and returns HTML (and optionally PDF via external service).
 * Requires Supabase service role or authenticated user (RLS) to read invoice.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const body = await req.json().catch(() => ({})) as { invoice_id?: string }
    const invoiceId = body?.invoice_id
    if (!invoiceId || typeof invoiceId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'invoice_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: invoice, error: invError } = await supabase
      .from('invoices')
      .select('*, customer:invoice_customers(*), line_items:invoice_line_items(*)')
      .eq('id', invoiceId)
      .single()
    if (invError || !invoice) {
      return new Response(
        JSON.stringify({ error: 'Invoice not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const customer = Array.isArray((invoice as { customer?: unknown }).customer)
      ? (invoice as { customer: unknown[] }).customer[0]
      : (invoice as { customer?: Record<string, unknown> }).customer
    const lineItems = (invoice as { line_items?: unknown[] }).line_items ?? []
    const vars: Record<string, string> = {
      customer_name: (customer as { name?: string })?.name ?? '',
      invoice_number: (invoice as { number?: string }).number ?? '',
      invoice_date: (invoice as { date?: string }).date ?? '',
      due_date: (invoice as { due_date?: string }).due_date ?? '',
      total: String(((invoice as { total_cents?: number }).total_cents ?? 0) / 100),
      currency: (invoice as { currency?: string }).currency ?? 'USD',
    }
    let html = `<html><head><meta charset="utf-8"/><style>body{font-family:Inter,sans-serif;padding:24px;color:#111827;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #E6E8EB;padding:8px 12px;text-align:left;}</style></head><body>`
    html += `<h1>Invoice ${vars.invoice_number}</h1>`
    html += `<p>To: ${vars.customer_name}</p>`
    html += `<p>Date: ${vars.invoice_date} | Due: ${vars.due_date}</p>`
    html += `<table><thead><tr><th>Description</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr></thead><tbody>`
    for (const row of lineItems as { description?: string; quantity?: number; unit_price_cents?: number; line_total_cents?: number }[]) {
      const amt = ((row.line_total_cents ?? 0) / 100).toFixed(2)
      html += `<tr><td>${(row.description ?? '').replace(/</g, '&lt;')}</td><td>${row.quantity ?? 0}</td><td>${((row.unit_price_cents ?? 0) / 100).toFixed(2)}</td><td>${amt}</td></tr>`
    }
    html += `</tbody></table><p><strong>Total: ${vars.currency} ${vars.total}</strong></p></body></html>`

    return new Response(
      JSON.stringify({ html, url: null, pdf_base64: null }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
