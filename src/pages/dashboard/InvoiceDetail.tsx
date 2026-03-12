import { useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AnimatedPage } from '@/components/AnimatedPage'
import { PDFPreviewPane } from '@/components/invoicing/PDFPreviewPane'
import {
  fetchInvoiceById,
  getInvoicePdfUrl,
  remindInvoice,
  recordPayment,
} from '@/lib/api'
import type { InvoiceStatus } from '@/types/invoicing'
import { ArrowLeft, Download, Mail, DollarSign, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

function formatCents(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

function statusVariant(status: InvoiceStatus): 'default' | 'secondary' | 'accent' | 'success' | 'destructive' {
  switch (status) {
    case 'paid':
      return 'success'
    case 'overdue':
      return 'destructive'
    case 'partially_paid':
    case 'sent':
      return 'accent'
    case 'draft':
      return 'secondary'
    default:
      return 'default'
  }
}

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('other')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10))

  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => fetchInvoiceById(id!),
    enabled: Boolean(id),
  })

  const remindMutation = useMutation({
    mutationFn: () => remindInvoice(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice', id] })
      toast.success('Reminder sent')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to send reminder'),
  })

  const recordPaymentMutation = useMutation({
    mutationFn: (payload: { amount_cents: number; method: string; date: string }) =>
      recordPayment(id!, { ...payload, transaction_id: null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice', id] })
      setRecordPaymentOpen(false)
      setPaymentAmount('')
      toast.success('Payment recorded')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to record payment'),
  })

  const fetchPdf = useCallback((invoiceId: string) => getInvoicePdfUrl(invoiceId), [])

  const handleRecordPayment = useCallback(() => {
    const amount = parseFloat(paymentAmount)
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    recordPaymentMutation.mutate({
      amount_cents: Math.round(amount * 100),
      method: paymentMethod,
      date: paymentDate,
    })
  }, [paymentAmount, paymentMethod, paymentDate, recordPaymentMutation])

  const payments = invoice?.payments ?? []
  const paidTotal = payments.reduce((sum, p) => sum + (p.amount_cents ?? 0), 0)
  const totalCents = invoice?.total_cents ?? 0
  const isPaid = invoice?.status === 'paid'
  const isOverdue = invoice?.status === 'overdue'
  const canRemind = !isPaid && (invoice?.status === 'sent' || invoice?.status === 'unpaid' || isOverdue)

  if (!id) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          <p className="text-muted-foreground">Invalid invoice.</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard/finance">Back to Finance</Link>
          </Button>
        </main>
      </div>
    )
  }

  if (isLoading || error) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden />
          ) : (
            <div>
              <p className="text-muted-foreground">Invoice not found or error loading.</p>
              <Button asChild className="mt-4">
                <Link to="/dashboard/finance">Back to Finance</Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    )
  }

  if (!invoice) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild aria-label="Back">
              <Link to="/dashboard/finance">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{invoice.number}</h1>
              <p className="text-sm text-muted-foreground">
                {(invoice as { customer?: { name?: string; email?: string } }).customer?.name ?? '—'}
              </p>
            </div>
            <Badge variant={statusVariant(invoice.status)}>{invoice.status.replace('_', ' ')}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="gap-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  getInvoicePdfUrl(invoice.id).then((r) => {
                    if (r.url) window.open(r.url, '_blank')
                    else if (r.error) toast.error(r.error)
                  })
                }}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </Button>
            {canRemind && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => remindMutation.mutate()}
                disabled={remindMutation.isPending}
              >
                {remindMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Remind
              </Button>
            )}
            {!isPaid && (
              <Button variant="accent" size="sm" className="gap-2" onClick={() => setRecordPaymentOpen(true)}>
                <DollarSign className="h-4 w-4" />
                Record payment
              </Button>
            )}
          </div>
        </header>

        <div className="p-6 max-w-[1200px] mx-auto space-y-6">
          <AnimatedPage>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{invoice.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due date</span>
                    <span>{invoice.due_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums">{formatCents(invoice.subtotal_cents, invoice.currency)}</span>
                  </div>
                  {invoice.taxes_cents > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="tabular-nums">{formatCents(invoice.taxes_cents, invoice.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">{formatCents(totalCents, invoice.currency)}</span>
                  </div>
                  {paidTotal > 0 && (
                    <div className="flex justify-between text-[rgb(var(--success))]">
                      <span>Paid</span>
                      <span className="tabular-nums">{formatCents(paidTotal, invoice.currency)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment history</CardTitle>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No payments yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {payments.map((p) => (
                        <li
                          key={p.id}
                          className="flex justify-between items-center py-2 border-b border-border last:border-0 text-sm"
                        >
                          <span className="text-muted-foreground">{p.date}</span>
                          <span className="tabular-nums font-medium">
                            {formatCents(p.amount_cents, invoice.currency)}
                          </span>
                          <span className="text-muted-foreground capitalize">{p.method}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Line items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="pb-2 pr-4">Description</th>
                        <th className="pb-2 pr-4 text-right">Qty</th>
                        <th className="pb-2 pr-4 text-right">Unit price</th>
                        <th className="pb-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(invoice.line_items ?? []).map((item, idx) => (
                        <tr key={item.id ?? idx} className="border-b border-border">
                          <td className="py-2 pr-4">{item.description}</td>
                          <td className="py-2 pr-4 text-right">{item.quantity}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">
                            {formatCents(item.unit_price_cents, invoice.currency)}
                          </td>
                          <td className="py-2 text-right tabular-nums font-medium">
                            {formatCents(item.line_total_cents ?? 0, invoice.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <PDFPreviewPane invoiceId={invoice.id} onFetchPdf={fetchPdf} />
            </div>
          </AnimatedPage>
        </div>
      </main>

      <Dialog open={recordPaymentOpen} onOpenChange={setRecordPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Amount</Label>
              <Input
                id="payment-amount"
                type="number"
                min="0"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-date">Date</Label>
              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-method">Method</Label>
              <select
                id="payment-method"
                className="flex h-11 w-full rounded-[10px] border border-input bg-card px-4 py-3 text-sm"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="card">Card</option>
                <option value="bank">Bank transfer</option>
                <option value="cash">Cash</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecordPaymentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} disabled={recordPaymentMutation.isPending}>
              {recordPaymentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
