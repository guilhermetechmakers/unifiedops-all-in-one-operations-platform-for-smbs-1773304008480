import { useState, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useAuth } from '@/contexts/AuthContext'
import { InvoiceLineItemEditor } from '@/components/invoicing/InvoiceLineItemEditor'
import { TemplateEditor } from '@/components/invoicing/TemplateEditor'
import { PDFPreviewPane } from '@/components/invoicing/PDFPreviewPane'
import {
  fetchInvoiceCustomers,
  fetchInvoiceTemplates,
  createInvoice,
  getInvoicePdfUrl,
  sendInvoiceEmail,
} from '@/lib/api'
import type { InvoiceLineItem, InvoiceTemplate } from '@/types/invoicing'
import { useQuery } from '@tanstack/react-query'
import { FileText, Send, Save } from 'lucide-react'

const createInvoiceSchema = z.object({
  customer_id: z.string().min(1, 'Select a customer'),
  due_date: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
  terms: z.string().optional(),
  template_id: z.string().optional().nullable(),
})

type CreateInvoiceForm = z.infer<typeof createInvoiceSchema>

const defaultLineItems: InvoiceLineItem[] = [
  {
    description: '',
    quantity: 1,
    unit_price_cents: 0,
    tax_rate: 0,
    discount_cents: 0,
    line_total_cents: 0,
  },
]

export default function CreateInvoice() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const organizationId = profile?.organization_id ?? null
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(defaultLineItems)
  const [templateHtml, setTemplateHtml] = useState<string>('')
  const [createdId, setCreatedId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)

  const { data: customers = [] } = useQuery({
    queryKey: ['invoice-customers', organizationId],
    queryFn: () => fetchInvoiceCustomers(organizationId ?? ''),
    enabled: Boolean(organizationId),
  })
  const { data: templates = [] } = useQuery({
    queryKey: ['invoice-templates', organizationId],
    queryFn: () => fetchInvoiceTemplates(organizationId),
    enabled: Boolean(organizationId),
  })

  const templateList = Array.isArray(templates) ? templates : []
  const customerList = Array.isArray(customers) ? customers : []

  const form = useForm<CreateInvoiceForm>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customer_id: '',
      due_date: new Date().toISOString().slice(0, 10),
      notes: '',
      terms: '',
      template_id: '',
    },
  })

  const selectedCustomer = useMemo(
    () => customerList.find((c) => c.id === form.watch('customer_id')),
    [customerList, form.watch('customer_id')]
  )
  const selectedTemplate = useMemo(
    () => templateList.find((t) => t.id === form.watch('template_id')) ?? null,
    [templateList, form.watch('template_id')]
  )

  const previewVariables = useMemo(
    () => ({
      customer_name: selectedCustomer?.name ?? '',
      invoice_number: 'INV-PREVIEW',
      invoice_date: new Date().toISOString().slice(0, 10),
      due_date: form.watch('due_date') ?? '',
      subtotal: (lineItems ?? []).reduce((s, i) => s + (i.line_total_cents ?? 0) / 100, 0).toFixed(2),
      taxes: '0',
      total: (lineItems ?? []).reduce((s, i) => s + (i.line_total_cents ?? 0) / 100, 0).toFixed(2),
      currency: 'USD',
      line_items: '',
    }),
    [selectedCustomer, form.watch('due_date'), lineItems]
  )

  const handleSaveDraft = useCallback(async () => {
    if (!organizationId) {
      toast.error('Organization required. Complete onboarding.')
      return
    }
    const values = form.getValues()
    const valid = await form.trigger()
    if (!valid) return
    const items = (lineItems ?? []).filter((i) => i.description.trim() || i.quantity > 0)
    if (items.length === 0) {
      toast.error('Add at least one line item.')
      return
    }
    setSaving(true)
    try {
      const { data, error } = await createInvoice(organizationId, {
        customer_id: values.customer_id,
        due_date: values.due_date,
        notes: values.notes ?? null,
        terms: values.terms ?? null,
        template_id: values.template_id || null,
        line_items: items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unit_price_cents: i.unit_price_cents,
          tax_rate: i.tax_rate,
          discount_cents: i.discount_cents ?? 0,
          line_total_cents: i.line_total_cents ?? 0,
          sort_order: 0,
        })),
      })
      if (error) {
        toast.error(error)
        return
      }
      if (data?.id) {
        setCreatedId(data.id)
        toast.success('Draft saved.')
        navigate(`/dashboard/invoices/${data.id}`)
      }
    } finally {
      setSaving(false)
    }
  }, [organizationId, form, lineItems, navigate])

  const handleSend = useCallback(async () => {
    if (!organizationId) {
      toast.error('Organization required.')
      return
    }
    const values = form.getValues()
    const valid = await form.trigger()
    if (!valid) return
    const items = (lineItems ?? []).filter((i) => i.description.trim() || i.quantity > 0)
    if (items.length === 0) {
      toast.error('Add at least one line item.')
      return
    }
    setSending(true)
    try {
      const { data: inv, error: createErr } = await createInvoice(organizationId, {
        customer_id: values.customer_id,
        due_date: values.due_date,
        notes: values.notes ?? null,
        terms: values.terms ?? null,
        template_id: values.template_id || null,
        line_items: items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unit_price_cents: i.unit_price_cents,
          tax_rate: i.tax_rate,
          discount_cents: i.discount_cents ?? 0,
          line_total_cents: i.line_total_cents ?? 0,
          sort_order: 0,
        })),
      })
      if (createErr || !inv?.id) {
        toast.error(createErr ?? 'Failed to create invoice')
        return
      }
      const email = selectedCustomer?.email
      if (email) {
        const sendErr = await sendInvoiceEmail(inv.id, { recipients: [email] })
        if (sendErr.error) toast.warning('Invoice created but send failed: ' + sendErr.error)
        else toast.success('Invoice created and sent.')
      } else {
        toast.success('Invoice created.')
      }
      navigate(`/dashboard/invoices/${inv.id}`)
    } finally {
      setSending(false)
    }
  }, [organizationId, form, lineItems, selectedCustomer, navigate])

  const fetchPdf = useCallback(
    (id: string) => getInvoicePdfUrl(id),
    []
  )

  if (!organizationId) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          <AnimatedPage>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Complete onboarding to create invoices.</p>
                <Button asChild className="mt-4">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </AnimatedPage>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur h-16 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">New invoice</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              Save draft
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/finance">Cancel</Link>
            </Button>
          </div>
        </header>
        <div className="p-6 max-w-[1200px] mx-auto">
          <AnimatedPage>
            <Tabs defaultValue="compose" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="compose">Compose</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="send">Send</TabsTrigger>
              </TabsList>

              <TabsContent value="compose" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="customer_id">Customer</Label>
                        <select
                          id="customer_id"
                          className="flex h-11 w-full rounded-[10px] border border-input bg-card px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                          {...form.register('customer_id')}
                        >
                          <option value="">Select customer</option>
                          {customerList.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.email})
                            </option>
                          ))}
                        </select>
                        {form.formState.errors.customer_id && (
                          <p className="text-sm text-destructive">{form.formState.errors.customer_id.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="due_date">Due date</Label>
                        <Input id="due_date" type="date" {...form.register('due_date')} />
                        {form.formState.errors.due_date && (
                          <p className="text-sm text-destructive">{form.formState.errors.due_date.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template_id">Template</Label>
                      <select
                        id="template_id"
                        className="flex h-11 w-full rounded-[10px] border border-input bg-card px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                        {...form.register('template_id')}
                        onChange={(e) => {
                          form.setValue('template_id', e.target.value || null)
                          const t = templateList.find((x) => x.id === e.target.value) as InvoiceTemplate | undefined
                          if (t?.html_template) setTemplateHtml(t.html_template)
                        }}
                      >
                        <option value="">Default</option>
                        {templateList.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" placeholder="Optional notes" {...form.register('notes')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="terms">Terms</Label>
                      <Textarea id="terms" placeholder="Payment terms" {...form.register('terms')} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Line items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InvoiceLineItemEditor
                      items={lineItems}
                      onChange={setLineItems}
                      currency="USD"
                    />
                  </CardContent>
                </Card>

                {selectedTemplate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Template</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TemplateEditor
                        html={templateHtml || selectedTemplate.html_template}
                        onChange={setTemplateHtml}
                        variables={previewVariables}
                      />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <PDFPreviewPane
                  invoiceId={createdId}
                  htmlContent={templateHtml || null}
                  onFetchPdf={createdId ? fetchPdf : undefined}
                />
                {!createdId && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Save draft or send to generate a PDF preview from the server.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="send" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Send invoice</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Recipient: {selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.email})` : 'Select a customer'}
                    </p>
                    <Button
                      onClick={handleSend}
                      disabled={sending || !form.watch('customer_id')}
                      className="gap-2"
                    >
                      {sending ? 'Creating…' : null}
                      <Send className="h-4 w-4" />
                      Create & send invoice
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
