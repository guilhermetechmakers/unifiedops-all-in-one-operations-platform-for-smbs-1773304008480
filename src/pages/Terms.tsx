import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'

const sections = [
  { id: 'acceptance', title: 'Acceptance of Terms', content: 'By using UnifiedOps you agree to these terms. If you do not agree, do not use the service.' },
  { id: 'service', title: 'Description of Service', content: 'UnifiedOps provides an all-in-one operations platform including CRM, project management, finance, documents, and team messaging. We reserve the right to modify or discontinue features.' },
  { id: 'billing', title: 'Billing and Payment', content: 'Subscription fees are billed in advance. You may upgrade or downgrade; proration may apply. Refunds are handled according to our refund policy.' },
  { id: 'conduct', title: 'Acceptable Use', content: 'You agree not to misuse the service, violate laws, or infringe others\' rights. We may suspend or terminate accounts for violations.' },
  { id: 'liability', title: 'Limitation of Liability', content: 'To the extent permitted by law, our liability is limited. We do not guarantee uninterrupted or error-free service.' },
  { id: 'contact', title: 'Legal Contact', content: 'For legal or terms-related inquiries: legal@unifiedops.example.com.' },
]

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container-narrow flex-1 py-12 md:py-16">
        <AnimatedPage>
          <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          <p className="mt-2 text-muted-foreground">Version 1.0 · Last updated: {new Date().toLocaleDateString()}</p>
          <nav className="mt-8 flex flex-wrap gap-4 border-b border-border pb-6">
            {sections.map(({ id, title }) => (
              <a key={id} href={`#${id}`} className="text-sm font-medium text-accent hover:underline">
                {title}
              </a>
            ))}
          </nav>
          <div className="mt-8 space-y-10">
            {sections.map(({ id, title, content }) => (
              <section key={id} id={id}>
                <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">{content}</p>
              </section>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/contact" className="text-sm font-medium text-accent hover:underline">
              Contact legal
            </Link>
          </div>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
