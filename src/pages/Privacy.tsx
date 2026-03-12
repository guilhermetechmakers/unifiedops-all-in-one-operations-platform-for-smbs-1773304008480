import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { AnimatedPage } from '@/components/AnimatedPage'

const sections = [
  { id: 'collection', title: 'Data We Collect', content: 'We collect information you provide (account, profile, content), usage data, and device information to operate and improve the service.' },
  { id: 'use', title: 'How We Use Data', content: 'We use your data to provide the service, communicate with you, improve our product, and comply with legal obligations.' },
  { id: 'sharing', title: 'Data Sharing', content: 'We do not sell your data. We may share data with service providers (hosting, analytics, payment processors) under strict agreements.' },
  { id: 'security', title: 'Security', content: 'We use industry-standard measures to protect your data, including encryption and access controls.' },
  { id: 'rights', title: 'Your Rights', content: 'You may access, correct, or delete your data. Contact us for requests or to download your data.' },
  { id: 'contact', title: 'Contact', content: 'For privacy questions or to exercise your rights, contact us at privacy@unifiedops.example.com.' },
]

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container-narrow flex-1 py-12 md:py-16">
        <AnimatedPage>
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          <nav className="mt-8 flex flex-wrap gap-4 border-b border-border pb-6">
            {sections.map(({ id, title }) => (
              <a key={id} href={`#${id}`} className="text-sm font-medium text-accent hover:underline">
                {title}
              </a>
            ))}
          </nav>
          <div className="prose prose-slate max-w-none mt-8 space-y-10">
            {sections.map(({ id, title, content }) => (
              <section key={id} id={id}>
                <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">{content}</p>
              </section>
            ))}
          </div>
          <div className="mt-12 flex gap-4">
            <Button variant="outline" asChild>
              <a href="/privacy.pdf" download>Download PDF</a>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
