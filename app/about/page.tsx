import MarketingNav from '@/components/layout/MarketingNav'
import MarketingFooter from '@/components/layout/MarketingFooter'
import Card from '@/components/ui/Card'

export const metadata = { title: 'About — FinVest' }

const VALUES = [
  { title: 'Transparency', desc: 'Every recommendation shows its reasoning — no black-box advice.' },
  { title: 'Accessibility', desc: 'Institutional-grade planning tools, priced for every Indian investor.' },
  { title: 'Data-driven', desc: 'AI models trained on real market data, not guesswork.' },
]

export default function AboutPage() {
  return (
    <>
      <MarketingNav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 fade-up">
        <p className="label mb-2">About Us</p>
        <h1 className="display-xl mb-6">Building the future of personal finance in India</h1>
        <p className="body-lg mb-6">
          FinVest was founded to close the gap between institutional-grade financial planning
          and everyday investors. We combine AI-driven analysis with simple, actionable tools —
          so anyone can plan their goals, understand their risk, and grow their wealth with confidence.
        </p>
        <p className="body-lg mb-12">
          Our engines are built by a small team of engineers and finance practitioners who believe
          good financial guidance shouldn&apos;t be locked behind expensive advisors.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VALUES.map((v) => (
            <Card key={v.title}>
              <p className="title-sm mb-2">{v.title}</p>
              <p className="body-sm">{v.desc}</p>
            </Card>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </>
  )
}
