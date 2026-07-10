import MarketingNav from '@/components/layout/MarketingNav'
import MarketingFooter from '@/components/layout/MarketingFooter'
import Card from '@/components/ui/Card'

export const metadata = { title: 'Testimonials — FinVest' }

const TESTIMONIALS = [
  { name: 'Rahul Sharma', role: 'Software Engineer, Bengaluru', quote: 'The Goal Planner made my home-down-payment SIP crystal clear. No more guesswork.' },
  { name: 'Priya Nair', role: 'Freelance Designer, Kochi', quote: 'Risk Profiler nailed my comfort level in under two minutes. Genuinely useful.' },
  { name: 'Amit Verma', role: 'Business Owner, Pune', quote: 'Portfolio Optimizer gave me a clearer allocation than my previous advisor.' },
]

export default function TestimonialsPage() {
  return (
    <>
      <MarketingNav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 fade-up">
          <p className="label mb-2">Testimonials</p>
          <h1 className="display-xl">Trusted by investors across India</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <p className="body-sm mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{t.name}</p>
              <p className="caption">{t.role}</p>
            </Card>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </>
  )
}
