'use client'
import Link from 'next/link'
import { useState } from 'react'
import MarketingNav from '@/components/layout/MarketingNav'
import MarketingFooter from '@/components/layout/MarketingFooter'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { FEATURES, PLAN_PRICE } from '@/lib/utils'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export default function PublicPricingPage() {
  const { uid, plan: currentPlan } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const subscribe = async (planId: string) => {
    if (planId === 'free' || planId === currentPlan) return
    setLoadingPlan(planId)
    try {
      await apiClient.createOrder({ plan_id: planId })
      // Hand off the order response to your payment gateway's checkout SDK
      // here, then call apiClient.verifyPayment() on success.
      toast.success('Order created — continue in the payment window')
    } catch (err: any) {
      toast.error(err?.message || 'Could not start checkout')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <>
      <MarketingNav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 fade-up">
          <p className="label mb-2">Plans</p>
          <h1 className="display-xl mb-3">Choose the plan that fits your goals</h1>
          <p className="body-lg">Start free. Upgrade anytime as your portfolio grows.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {Object.entries(FEATURES).map(([id, features]) => {
            const isCurrent = uid && id === currentPlan
            return (
              <Card key={id} gold={id === 'pro'}>
                <p className="title-sm mb-1 capitalize">{id}</p>
                <p className="display-md mb-4" style={{ color: 'var(--gold)' }}>{PLAN_PRICE[id]}</p>
                <div className="flex flex-col gap-2 mb-6">
                  {features.map((f) => <p key={f} className="body-sm">✓ {f}</p>)}
                </div>
                {isCurrent ? (
                  <Button className="w-full" variant="outline" disabled>Current Plan</Button>
                ) : uid ? (
                  <Button className="w-full" variant={id === 'pro' ? 'primary' : 'outline'} loading={loadingPlan === id} onClick={() => subscribe(id)}>
                    {id === 'free' ? 'Downgrade' : 'Choose Plan'}
                  </Button>
                ) : (
                  <Link href="/auth/signup">
                    <Button className="w-full" variant={id === 'pro' ? 'primary' : 'outline'}>{id === 'free' ? 'Start Free' : 'Get Started'}</Button>
                  </Link>
                )}
              </Card>
            )
          })}
        </div>
      </main>
      <MarketingFooter />
    </>
  )
}
