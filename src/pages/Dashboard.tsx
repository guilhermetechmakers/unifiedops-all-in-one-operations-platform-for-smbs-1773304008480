import { Link } from 'react-router-dom'
import { DollarSign, FileText, Users, TrendingUp, Plus, Bell } from 'lucide-react'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const kpis = [
  { label: 'Revenue (MTD)', value: '$24,500', change: '+12%', icon: DollarSign },
  { label: 'Outstanding invoices', value: '$8,200', change: '-5%', icon: FileText },
  { label: 'Active contacts', value: '142', change: '+8', icon: Users },
  { label: 'Projects on track', value: '9/12', change: '75%', icon: TrendingUp },
]

const chartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
]

const activity = [
  { id: 1, text: 'Invoice #1023 paid by Acme Corp', time: '2h ago' },
  { id: 2, text: 'New contact added: Jane Doe', time: '5h ago' },
  { id: 3, text: 'Project "Website Redesign" milestone completed', time: '1d ago' },
]

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur flex h-16 items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard/invoices/new">
                <Plus className="h-4 w-4 mr-1" />
                New invoice
              </Link>
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-8">
          <AnimatedPage>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map(({ label, value, change, icon: Icon }, i) => (
                <Card key={label} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{change} from last period</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Cashflow snapshot</CardTitle>
                  <CardDescription>Monthly revenue (last 6 months)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                      <YAxis className="text-xs text-muted-foreground" />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid rgb(var(--border))' }}
                        formatter={(value: number) => [`$${value}`, 'Revenue']}
                      />
                      <Bar dataKey="value" fill="rgb(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent activity</CardTitle>
                  <CardDescription>Latest updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {activity.map(({ id, text, time }) => (
                      <li key={id} className="flex justify-between gap-2 text-sm">
                        <span className="text-foreground">{text}</span>
                        <span className="text-muted-foreground shrink-0">{time}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Button variant="outline" asChild>
                <Link to="/dashboard/crm">View contacts</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/dashboard/projects">View projects</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/dashboard/finance">Finance overview</Link>
              </Button>
            </div>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
