'use client'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'
import { formatCurrency, formatDate, FEATURES } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

export default function SubscriptionPage() {
  const { plan, planName, planExpiry, isExpired, daysLeft } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['payment-history'],
    queryFn: () => apiClient.getPaymentHistory().then((r) => r.data),
    staleTime: 60_000,
  })
  const payments = data?.payments || []
  const planBadge: Record<string, string> = { free: 'gray', basic: 'blue', pro: 'gold', elite: 'purple' }
  const statusBadge: Record<string, string> = { SUCCESS: 'green', FAILED: 'red', PENDING: 'gold' }

  return (
    <div className="max-w-2xl fade-up pb-24 md:pb-0">
      <div className="mb-8">
        <p className="label mb-1.5">Billing</p>
        <h1 className="display-md">Subscription</h1>
      </div>

      <Card gold className="mb-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <Badge variant={planBadge[plan] || 'gray'} className="mb-2">{planName}</Badge>
            <h2 className="display-md" style={{ color: 'var(--gold)' }}>{planName}</h2>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'var(--gold-dim)', border: '1px solid var(--border-gold)' }}>
            {plan === 'free' ? '⭐' : plan === 'basic' ? '🔵' : plan === 'pro' ? '⚡' : '👑'}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl mb-5" style={{ background: 'var(--bg-overlay)' }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{plan === 'free' ? 'Free forever' : isExpired ? '⚠ Plan expired' : `${daysLeft} days remaining`}</p>
            {planExpiry && <p className="caption mt-0.5">Expires {formatDate(planExpiry)}</p>}
          </div>
          <Badge variant={isExpired ? 'red' : plan === 'free' ? 'gray' : 'green'}>{isExpired ? 'Expired' : 'Active'}</Badge>
        </div>

        <div className="mb-5">
          <p className="label mb-3">Included in your plan</p>
          <div className="grid grid-cols-1 gap-1.5">
            {(FEATURES[plan] || FEATURES.free).map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-2)' }}><span style={{ color: 'var(--green)' }}>✓</span>{f}</div>
            ))}
          </div>
        </div>

        <Link href="/pricing"><Button className="w-full">{isExpired ? 'Renew Plan' : plan === 'free' ? 'Upgrade Plan' : 'Change Plan'}</Button></Link>
      </Card>

      <Card>
        <h2 className="title-sm mb-5">Payment History</h2>
        {isLoading ? (
          <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: 'var(--bg-hover)' }} />)}</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-10"><div className="text-4xl mb-3">💳</div><p className="body-sm">No payments yet</p></div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="data-table w-full min-w-[480px]">
              <thead><tr><th>Order</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.order_id}>
                    <td><span className="mono text-xs" style={{ color: 'var(--text-3)' }}>{(p.order_id || '').slice(-10)}</span></td>
                    <td><Badge variant={planBadge[p.plan] || 'gray'}>{p.plan}</Badge></td>
                    <td><span className="mono font-semibold text-sm" style={{ color: 'var(--gold)' }}>{formatCurrency((p.amount || 0) / 100)}</span></td>
                    <td><Badge variant={statusBadge[p.status] || 'gray'}>{p.status}</Badge></td>
                    <td><span className="caption">{formatDate(p.date || p.created_at)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
