import { Link } from 'react-router-dom'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus } from 'lucide-react'

const cashflowData = [
  { month: 'Jan', value: 4000 },
  { month: 'Feb', value: 3500 },
  { month: 'Mar', value: 5200 },
  { month: 'Apr', value: 4800 },
  { month: 'May', value: 6100 },
  { month: 'Jun', value: 5800 },
]

const aging = [
  { range: 'Current', amount: 4200 },
  { range: '1-30 days', amount: 2100 },
  { range: '31-60 days', amount: 800 },
  { range: '61+ days', amount: 200 },
]

export default function FinanceOverview() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur flex h-16 items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">Finance</h1>
          <Button asChild>
            <Link to="/dashboard/invoices/new"><Plus className="h-4 w-4 mr-2" />New invoice</Link>
          </Button>
        </header>
        <div className="p-6 space-y-6">
          <AnimatedPage>
            <Card>
              <CardHeader>
                <CardTitle>Cashflow</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={cashflowData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs text-muted-foreground" />
                    <YAxis className="text-xs text-muted-foreground" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid rgb(var(--border))' }} />
                    <Line type="monotone" dataKey="value" stroke="rgb(var(--accent))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Receivables aging</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {aging.map(({ range, amount }) => (
                    <li key={range} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{range}</span>
                      <span className="font-medium text-foreground">${amount.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <div className="flex gap-3">
              <Button variant="outline" asChild><Link to="/dashboard/transactions">Transactions</Link></Button>
              <Button variant="outline" asChild><Link to="/dashboard/subscription">Subscription</Link></Button>
            </div>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
