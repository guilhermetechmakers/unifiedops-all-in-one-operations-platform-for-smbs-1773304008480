import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Search, Plus, Download, Upload } from 'lucide-react'

const mockContacts = [
  { id: '1', name: 'Acme Corp', email: 'billing@acme.com', company: 'Acme Corp', tags: ['Customer'] },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com', company: 'Example Inc', tags: ['Lead'] },
]

export default function CrmList() {
  const [search, setSearch] = useState('')

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur flex h-16 items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">Contacts</h1>
          <Button asChild>
            <Link to="/dashboard/crm/new">
              <Plus className="h-4 w-4 mr-2" />
              Add contact
            </Link>
          </Button>
        </header>
        <div className="p-6">
          <AnimatedPage>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>All contacts</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-1" />Import</Button>
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left p-3 font-medium text-foreground">Name</th>
                        <th className="text-left p-3 font-medium text-foreground">Email</th>
                        <th className="text-left p-3 font-medium text-foreground">Company</th>
                        <th className="text-left p-3 font-medium text-foreground">Tags</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockContacts.map((c) => (
                        <tr key={c.id} className="border-t border-border hover:bg-muted/20">
                          <td className="p-3"><Link to={`/dashboard/crm/${c.id}`} className="font-medium text-foreground hover:text-accent">{c.name}</Link></td>
                          <td className="p-3 text-muted-foreground">{c.email}</td>
                          <td className="p-3 text-muted-foreground">{c.company}</td>
                          <td className="p-3">{c.tags.map((t) => <Badge key={t} variant="secondary" className="mr-1">{t}</Badge>)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-4">2 contacts</p>
              </CardContent>
            </Card>
          </AnimatedPage>
        </div>
      </main>
    </div>
  )
}
