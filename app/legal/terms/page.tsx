import MarketingNav from '@/components/layout/MarketingNav'
import MarketingFooter from '@/components/layout/MarketingFooter'

export const metadata = { title: 'Terms of Service — FinVest' }

export default function TermsPage() {
  return (
    <>
      <MarketingNav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 fade-up">
        <h1 className="display-md mb-6">Terms of Service</h1>
        <div className="flex flex-col gap-5 body-sm">
          <p>Last updated: July 2026</p>
          <p>
            FinVest provides AI-generated financial planning tools for informational purposes only.
            Content and calculations on this platform do not constitute investment advice and FinVest
            is not a SEBI-registered investment advisor.
          </p>
          <p>
            By using FinVest, you agree that all investment decisions are made at your own discretion
            and risk. Past performance and projected figures are illustrative and not guarantees of
            future results.
          </p>
          <p>
            Subscription plans renew based on the billing cycle selected at checkout. You may cancel
            or change your plan at any time from the Subscription page; access to paid engines ends
            at the close of the current billing period.
          </p>
          <p>
            We may update these terms from time to time. Continued use of FinVest after changes
            constitutes acceptance of the revised terms.
          </p>
        </div>
      </main>
      <MarketingFooter />
    </>
  )
}
