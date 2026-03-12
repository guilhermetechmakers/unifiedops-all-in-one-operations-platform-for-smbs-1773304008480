import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, CreditCard, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AnimatedPage } from '@/components/AnimatedPage'
import { cn } from '@/lib/utils'

const steps = [
  { id: 1, title: 'Company profile', icon: Building2 },
  { id: 2, title: 'Invite team', icon: Users },
  { id: 3, title: 'Connect Stripe', icon: CreditCard },
  { id: 4, title: 'Templates', icon: FileText },
]

export default function Onboarding() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  const progress = ((current + 1) / steps.length) * 100

  const handleNext = () => {
    if (current < steps.length - 1) setCurrent((c) => c + 1)
    else navigate('/dashboard')
  }

  const handleSkip = () => navigate('/dashboard')

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card py-4">
        <div className="container-narrow flex items-center justify-between">
          <span className="font-semibold text-foreground">UnifiedOps</span>
          <span className="text-sm text-muted-foreground">Setup</span>
        </div>
      </header>
      <main className="container-narrow flex-1 py-12 max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {current + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatedPage key={current}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2">
                  {(() => {
                    const Icon = steps[current].icon
                    return <Icon className="h-5 w-5 text-accent" />
                  })()}
                </div>
                <div>
                  <CardTitle>{steps[current].title}</CardTitle>
                  <CardDescription>Complete this step or skip to continue later.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {current === 0 && (
                <>
                  <div>
                    <Label htmlFor="company-name">Company name</Label>
                    <Input id="company-name" placeholder="Acme Inc." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="company-email">Business email</Label>
                    <Input id="company-email" type="email" placeholder="hello@acme.com" className="mt-1" />
                  </div>
                </>
              )}
              {current === 1 && (
                <div>
                  <Label htmlFor="invite-emails">Team member emails (comma-separated)</Label>
                  <Input id="invite-emails" placeholder="jane@acme.com, bob@acme.com" className="mt-1" />
                </div>
              )}
              {current === 2 && (
                <p className="text-muted-foreground">
                  Connect your Stripe account to accept payments and manage subscriptions. You can do this later in Settings.
                </p>
              )}
              {current === 3 && (
                <p className="text-muted-foreground">
                  Choose project or invoice templates to get started quickly. You can add more later.
                </p>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleNext}>
                  {current < steps.length - 1 ? 'Next' : 'Finish'}
                </Button>
                <Button variant="ghost" onClick={handleSkip}>Skip for now</Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedPage>

        <div className="mt-8 flex justify-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Step ${i + 1}`}
              className={cn(
                'h-2 w-2 rounded-full transition-colors',
                i === current ? 'bg-accent' : 'bg-muted'
              )}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
