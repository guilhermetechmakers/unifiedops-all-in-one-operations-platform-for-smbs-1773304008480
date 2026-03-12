import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AnimatedPage } from '@/components/AnimatedPage'

const categories = [
  { name: 'Essential', description: 'Required for the site to function (e.g. session, security).' },
  { name: 'Analytics', description: 'Help us understand how visitors use the site.' },
  { name: 'Marketing', description: 'Used to deliver relevant ads and measure campaigns.' },
]

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container-narrow flex-1 py-12 md:py-16">
        <AnimatedPage>
          <h1 className="text-3xl font-bold text-foreground">Cookie Policy</h1>
          <p className="mt-2 text-muted-foreground">
            We use cookies to provide and improve our service. You can manage your preferences below.
          </p>
          <section className="mt-10 space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Cookie categories</h2>
            {categories.map(({ name, description }) => (
              <div key={name} className="rounded-lg border border-border p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-foreground">{name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
                <label className="flex items-center gap-2 shrink-0">
                  <input type="checkbox" defaultChecked={name === 'Essential'} disabled={name === 'Essential'} className="rounded border-input" />
                  <span className="text-sm">{name === 'Essential' ? 'Always on' : 'Enabled'}</span>
                </label>
              </div>
            ))}
          </section>
          <p className="mt-8 text-sm text-muted-foreground">
            For more about how we use data, see our{' '}
            <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
          </p>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
