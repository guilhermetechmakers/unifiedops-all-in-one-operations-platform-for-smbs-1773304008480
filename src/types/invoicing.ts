/**
 * Invoicing subsystem types for UnifiedOps.
 * Aligns with Supabase tables: invoice_customers, invoice_templates, invoices,
 * invoice_line_items, invoice_payments, invoice_reminders, recurring_invoices, plans, subscriptions.
 */

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'unpaid'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export type ReminderStatus = 'pending' | 'sent' | 'failed'

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing'

export type BillingCycle = 'monthly' | 'annual'

export interface InvoiceCustomer {
  id: string
  organization_id: string
  name: string
  email: string
  address?: string | null
  locale: string
  tax_exempt: boolean
  created_at: string
  updated_at: string
}

export interface InvoiceTemplate {
  id: string
  organization_id: string | null
  name: string
  html_template: string
  default_variables: Record<string, string>
  is_default: boolean
  preview_image_url?: string | null
  created_at: string
  updated_at: string
}

export interface InvoiceLineItem {
  id?: string
  invoice_id?: string
  description: string
  quantity: number
  unit_price_cents: number
  tax_rate: number
  discount_cents: number
  line_total_cents: number
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export interface Invoice {
  id: string
  organization_id: string
  customer_id: string
  number: string
  date: string
  due_date: string
  status: InvoiceStatus
  subtotal_cents: number
  taxes_cents: number
  discount_cents: number
  total_cents: number
  currency: string
  template_id?: string | null
  pdf_url?: string | null
  recurring_invoice_id?: string | null
  notes?: string | null
  terms?: string | null
  created_at: string
  updated_at: string
  customer?: InvoiceCustomer
  line_items?: InvoiceLineItem[]
  payments?: InvoicePayment[]
}

export interface InvoicePayment {
  id: string
  invoice_id: string
  date: string
  amount_cents: number
  method: string
  transaction_id?: string | null
  status: PaymentStatus
  created_at: string
  updated_at: string
}

export interface InvoiceReminder {
  id: string
  invoice_id: string
  send_date: string
  status: ReminderStatus
  channel: string
  template_id?: string | null
  created_at: string
}

export interface RecurringInvoice {
  id: string
  organization_id: string
  customer_id: string
  template_id?: string | null
  next_date: string
  frequency: RecurringFrequency
  end_date?: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  name: string
  price_cents: number
  currency: string
  billing_interval: string
  features: string[]
  max_invoices?: number | null
  allowed_users?: number | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  organization_id: string
  plan_id: string
  status: SubscriptionStatus
  billing_cycle: BillingCycle
  next_billing_date?: string | null
  payment_method_id?: string | null
  auto_renew: boolean
  created_at: string
  updated_at: string
  plan?: Plan
}

/** DTOs for create/update */
export interface CreateInvoiceInput {
  customer_id: string
  due_date: string
  currency?: string
  template_id?: string | null
  notes?: string | null
  terms?: string | null
  line_items: Omit<InvoiceLineItem, 'id' | 'invoice_id' | 'created_at' | 'updated_at'>[]
}

export interface UpdateInvoiceInput {
  due_date?: string
  status?: InvoiceStatus
  notes?: string | null
  terms?: string | null
  line_items?: Omit<InvoiceLineItem, 'invoice_id' | 'created_at' | 'updated_at'>[]
}

export interface RecordPaymentInput {
  date: string
  amount_cents: number
  method: string
  transaction_id?: string | null
}

export interface SendInvoiceInput {
  recipients: string[]
  locale?: string
  payment_terms?: string
  method?: 'email' | 'portal' | 'both'
}
