import Link from 'next/link'
import MarketingNav from '@/components/layout/MarketingNav'
import MarketingFooter from '@/components/layout/MarketingFooter'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { ENGINES } from '@/lib/utils'

export const metadata = { title: 'FinVest — AI-Powered Wealth Engines' }

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <main>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center fade-up">
          <p className="label mb-4">AI-Powered Financial Planning</p>
          <h1 className="display-xl mb-6">
            Grow your wealth with <span style={{ color: 'var(--gold)' }}>AI-driven</span> financial engines
          </h1>
          <p className="body-lg max-w-2xl mx-auto mb-8">
            Risk profiling, goal planning, retirement calculators, stock analysis, and portfolio
            optimization — all in one platform built for Indian investors.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/auth/signup"><Button size="lg">Start Free</Button></Link>
            <Link href="/pricing"><Button variant="outline" size="lg">View Pricing</Button></Link>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="display-md mb-2">7 AI Engines, One Platform</h2>
            <p className="body-sm">Everything you need to plan, track, and grow your investments.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            {ENGINES.map((e) => (
              <Card key={e.id}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4" style={{ background: `${e.color}15`, border: `1px solid ${e.color}25` }}>
                  {e.icon}
                </div>
                <p className="title-sm mb-1.5">{e.name}</p>
                <p className="body-sm" style={{ fontSize: '0.8125rem' }}>{e.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Card gold>
            <h2 className="display-md mb-3">Ready to take control of your finances?</h2>
            <p className="body-sm mb-6">Join thousands of Indian investors using FinVest to plan smarter.</p>
            <Link href="/auth/signup"><Button size="lg">Create Free Account</Button></Link>
          </Card>
        </section>
      </main>
      <MarketingFooter />
    </>
  )
}
