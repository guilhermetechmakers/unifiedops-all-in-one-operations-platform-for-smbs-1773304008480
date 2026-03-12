import { Link } from 'react-router-dom'
import { Users, FolderKanban, Wallet, FileText, MessageSquare, Plug } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedPage } from '@/components/AnimatedPage'

const features = [
  {
    icon: Users,
    title: 'CRM',
    description: 'Manage customers and leads in one place. Track deals and activity.',
  },
  {
    icon: FolderKanban,
    title: 'Projects',
    description: 'Kanban boards, milestones, and tasks. Link projects to invoices.',
  },
  {
    icon: Wallet,
    title: 'Finance',
    description: 'Invoicing, payments, bank sync, and receivables aging.',
  },
  {
    icon: FileText,
    title: 'Documents',
    description: 'Contracts, proposals, versioning, and share links.',
  },
  {
    icon: MessageSquare,
    title: 'Messaging',
    description: 'Team threads, mentions, and attachments.',
  },
  {
    icon: Plug,
    title: 'Integrations',
    description: 'Stripe, Plaid, SendGrid, and more.',
  },
]

const steps = [
  { step: 1, title: 'Sign up', description: 'Create your account and company profile.' },
  { step: 2, title: 'Connect', description: 'Link Stripe, invite your team, choose templates.' },
  { step: 3, title: 'Run operations', description: 'Manage CRM, projects, and finance in one place.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="container-narrow py-20 md:py-28 text-center">
          <AnimatedPage>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.1]">
              One platform for{' '}
              <span className="text-accent">operations</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              CRM, projects, finance, documents, and team messaging. Built for small and medium businesses.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">Start free trial</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          </AnimatedPage>
        </section>

        <section id="features" className="container-narrow py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
            Everything you need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <Card key={title} className="p-6 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <CardContent className="p-0">
                  <div className="rounded-xl bg-accent/10 p-3 w-fit mb-4">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="container-narrow py-16 md:py-24 border-t border-border">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
                  {step}
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-narrow py-16 md:py-24 border-t border-border text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Ready to simplify operations?</h2>
          <p className="text-muted-foreground mb-8">Start your free trial. No credit card required.</p>
          <Button size="lg" asChild>
            <Link to="/signup">Get started</Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  )
}
