import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const footerLinks = {
  Product: [
    { to: '/#features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/integrations', label: 'Integrations' },
  ],
  Company: [
    { to: '/about', label: 'About' },
    { to: '/help', label: 'Help' },
    { to: '/contact', label: 'Contact' },
  ],
  Legal: [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/cookies', label: 'Cookie Policy' },
  ],
}

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('border-t border-border bg-card', className)}>
      <div className="container-narrow py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-semibold text-foreground text-lg">
              UnifiedOps
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              All-in-one operations for SMBs. CRM, projects, finance, and team messaging in one place.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-foreground">{title}</h4>
              <ul className="mt-4 space-y-2">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} UnifiedOps. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
