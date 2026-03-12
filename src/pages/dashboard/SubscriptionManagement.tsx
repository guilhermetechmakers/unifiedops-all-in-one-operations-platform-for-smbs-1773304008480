import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useAuth } from '@/contexts/AuthContext'
import { fetchPlans, fetchSubscription, fetchInvoices, updateSubscription } from '@/lib/api'
import type { BillingCycle } from '@/types/invoicing'
import { CreditCard, FileText, Loader2 } from 'lucide-react'

function formatCents(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

export default function SubscriptionManagement() {
  const { profile } = useAuth()
  const organizationId = profile?.organization_id ?? null
  const queryClient = useQueryClient()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('monthly')

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['subscription', organizationId],
    queryFn: () => fetchSubscription(organizationId!),
    enabled: Boolean(organizationId),
  })
  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  })
  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices', organizationId],
    queryFn: () => fetchInvoices({ organizationId: organizationId! }),
    enabled: Boolean(organizationId),
  })

  const planList = Array.isArray(plans) ? plans : []
  const invoiceList = Array.isArray(invoices) ? invoices : []

  const updateMutation = useMutation({
    mutationFn: (payload: { plan_id?: string; billing_cycle?: string }) =>
      updateSubscription(organizationId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', organizationId] })
      toast.success('Subscription updated')
      setSelectedPlanId(null)
    },
    onError: (err: Error) => toast.error(err.message ?? 'Update failed'),
  })

  const handleUpgrade = () => {
    if (!selectedPlanId) {
      toast.error('Select a plan')
      return
    }
    updateMutation.mutate({ plan_id: selectedPlanId, billing_cycle: selectedCycle })
  }

  if (!organizationId) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          <AnimatedPage>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Complete onboarding to manage subscription.</p>
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
          <h1 className="text-lg font-semibold text-foreground">Subscription</h1>
          <Button variant="outline" asChild>
            <Link to="/dashboard/finance">Back to Finance</Link>
          </Button>
        </header>
        <div className="p-6 max-w-[1100px] mx-auto space-y-8">
          <AnimatedPage>
            {/* Current plan */}
            <Card>
              <CardHeader>
                <CardTitle>Current plan</CardTitle>
              </CardHeader>
              <CardContent>
                {subLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading…
                  </div>
                ) : subscription ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="font-medium text-foreground">
                      {(subscription as { plan?: { name?: string } }).plan?.name ?? 'Plan'}
                    </span>
                    <Badge variant="accent">{subscription.status}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Billing: {subscription.billing_cycle}
                      {subscription.next_billing_date && ` · Next: ${subscription.next_billing_date}`}
                    </span>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No active subscription. Choose a plan below.</p>
                )}
              </CardContent>
            </Card>

            {/* Change plan / billing cycle */}
            <Card>
              <CardHeader>
                <CardTitle>Change plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cycle"
                      checked={selectedCycle === 'monthly'}
                      onChange={() => setSelectedCycle('monthly')}
                      className="rounded-full border-border text-accent focus:ring-accent"
                    />
                    <span>Monthly</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cycle"
                      checked={selectedCycle === 'annual'}
                      onChange={() => setSelectedCycle('annual')}
                      className="rounded-full border-border text-accent focus:ring-accent"
                    />
                    <span>Annual (save when available)</span>
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {planList.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`cursor-pointer transition-all ${
                        selectedPlanId === plan.id
                          ? 'ring-2 ring-accent border-accent'
                          : 'hover:border-accent/50'
                      }`}
                      onClick={() => setSelectedPlanId(plan.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{plan.name}</CardTitle>
                        <p className="text-2xl font-semibold text-foreground">
                          {formatCents(plan.price_cents, plan.currency)}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{plan.billing_interval === 'year' ? 'year' : 'month'}
                          </span>
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {(plan.features ?? []).slice(0, 3).map((f, i) => (
                            <li key={i}>{typeof f === 'string' ? f : (f as { name?: string })?.name}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button
                  onClick={handleUpgrade}
                  disabled={!selectedPlanId || updateMutation.isPending}
                  className="gap-2"
                >
                  {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Update plan
                </Button>
              </CardContent>
            </Card>

            {/* Payment method placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Payment method is managed securely via your billing provider. Use the link in your account email to update.
                </p>
              </CardContent>
            </Card>

            {/* Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoiceList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No invoices yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-muted-foreground">
                          <th className="pb-2 pr-4">Number</th>
                          <th className="pb-2 pr-4">Date</th>
                          <th className="pb-2 pr-4">Status</th>
                          <th className="pb-2 text-right">Amount</th>
                          <th className="pb-2 pl-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceList.slice(0, 10).map((inv) => (
                          <tr key={inv.id} className="border-b border-border">
                            <td className="py-2 pr-4 font-medium">{inv.number}</td>
                            <td className="py-2 pr-4 text-muted-foreground">{inv.date}</td>
                            <td className="py-2 pr-4">
                              <Badge variant={inv.status === 'paid' ? 'success' : 'secondary'}>
                                {inv.status}
                              </Badge>
                            </td>
                            <td className="py-2 text-right tabular-nums">
                              {formatCents(inv.total_cents, inv.currency)}
                            </td>
                            <td className="py-2 pl-2">
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
                {invoiceList.length > 10 && (
                  <p className="mt-2 text-xs text-muted-foreground">Showing latest 10. View all from Finance.</p>
                )}
              </CardContent>
            </Card>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
