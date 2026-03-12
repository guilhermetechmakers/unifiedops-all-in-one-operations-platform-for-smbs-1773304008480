import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useAuth } from '@/contexts/AuthContext'
import { fetchInvoices } from '@/lib/api'
import type { InvoiceStatus } from '@/types/invoicing'
import { Plus, Search, FileText, Loader2 } from 'lucide-react'

function formatCents(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

function statusVariant(s: InvoiceStatus): 'default' | 'secondary' | 'accent' | 'success' | 'destructive' {
  if (s === 'paid') return 'success'
  if (s === 'overdue') return 'destructive'
  if (s === 'partially_paid' || s === 'sent') return 'accent'
  if (s === 'draft') return 'secondary'
  return 'default'
}

export default function InvoiceList() {
  const { profile } = useAuth()
  const organizationId = profile?.organization_id ?? null
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [search, setSearch] = useState('')

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices', organizationId, statusFilter],
    queryFn: () =>
      fetchInvoices({
        organizationId: organizationId!,
        ...(statusFilter ? { status: statusFilter } : {}),
      }),
    enabled: Boolean(organizationId),
  })

  const list = Array.isArray(invoices) ? invoices : []
  const filtered = search.trim()
    ? list.filter(
        (inv) =>
          inv.number?.toLowerCase().includes(search.toLowerCase()) ||
          (inv as { customer?: { name?: string } }).customer?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : list

  if (!organizationId) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          <AnimatedPage>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Complete onboarding to view invoices.</p>
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
          <h1 className="text-lg font-semibold text-foreground">Invoices</h1>
          <Button asChild className="gap-2">
            <Link to="/dashboard/invoices/new">
              <Plus className="h-4 w-4" />
              New invoice
            </Link>
          </Button>
        </header>
        <div className="p-6 max-w-[1200px] mx-auto">
          <AnimatedPage>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>All invoices</CardTitle>
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by number or customer…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <select
                    className="flex h-11 rounded-[10px] border border-input bg-card px-4 py-2 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All statuses</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="partially_paid">Partially paid</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4 opacity-50" />
                    <p className="font-medium text-foreground">No invoices yet</p>
                    <p className="text-sm mt-1">Create your first invoice to get started.</p>
                    <Button asChild className="mt-4">
                      <Link to="/dashboard/invoices/new">Create invoice</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-4 py-3 text-left font-medium text-foreground">Number</th>
                          <th className="px-4 py-3 text-left font-medium text-foreground">Customer</th>
                          <th className="px-4 py-3 text-left font-medium text-foreground">Date</th>
                          <th className="px-4 py-3 text-left font-medium text-foreground">Status</th>
                          <th className="px-4 py-3 text-right font-medium text-foreground">Amount</th>
                          <th className="px-4 py-3 w-24"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((inv) => (
                          <tr
                            key={inv.id}
                            className="border-b border-border transition-colors hover:bg-muted/20"
                          >
                            <td className="px-4 py-3 font-medium">
                              <Link
                                to={`/dashboard/invoices/${inv.id}`}
                                className="text-foreground hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                              >
                                {inv.number}
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {(inv as { customer?: { name?: string } }).customer?.name ?? '—'}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{inv.date}</td>
                            <td className="px-4 py-3">
                              <Badge variant={statusVariant(inv.status)}>
                                {inv.status.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums font-medium">
                              {formatCents(inv.total_cents, inv.currency)}
                            </td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/dashboard/invoices/${inv.id}`}>View</Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
