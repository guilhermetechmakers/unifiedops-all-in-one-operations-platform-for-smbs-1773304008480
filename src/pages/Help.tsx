import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AnimatedPage } from '@/components/AnimatedPage'

const faqs = [
  { q: 'How do I invite my team?', a: 'Go to Settings → Team and click Invite. Enter email addresses and assign roles.' },
  { q: 'How do I connect Stripe?', a: 'In Onboarding or Settings → Integrations, choose Stripe and follow the connection flow.' },
  { q: 'Can I export my data?', a: 'Yes. In Settings → Data you can request an export. We will email you a download link.' },
  { q: 'How do I reset my password?', a: 'On the login page, click Forgot password and enter your email. Check your inbox for the reset link.' },
]

export default function Help() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container-narrow flex-1 py-12 md:py-16">
        <AnimatedPage>
          <h1 className="text-3xl font-bold text-foreground">Help & FAQ</h1>
          <p className="mt-2 text-muted-foreground">
            Find answers below or contact support.
          </p>

          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map(({ q, a }) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger>{q}</AccordionTrigger>
                  <AccordionContent>{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="mt-16">
            <h2 className="text-xl font-semibold text-foreground mb-4">Contact support</h2>
            {submitted ? (
              <p className="text-muted-foreground">Thanks! We’ll get back to you soon.</p>
            ) : (
              <form
                className="max-w-md space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
              >
                <div>
                  <Label htmlFor="help-email">Email</Label>
                  <Input id="help-email" type="email" placeholder="you@company.com" className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="help-message">Message</Label>
                  <Textarea id="help-message" placeholder="Describe your issue..." className="mt-1 min-h-[120px]" required />
                </div>
                <Button type="submit">Send</Button>
              </form>
            )}
          </section>

          <p className="mt-8 text-sm text-muted-foreground">
            <Link to="/dashboard" className="text-accent hover:underline">Back to Dashboard</Link>
            {' · '}
            <a href="https://docs.unifiedops.example.com" className="text-accent hover:underline">Knowledge base</a>
          </p>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
