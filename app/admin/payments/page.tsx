'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const STATUS_FILTER = [{ value: '', label: 'All Statuses' }, { value: 'SUCCESS', label: 'Success' }, { value: 'FAILED', label: 'Failed' }, { value: 'PENDING', label: 'Pending' }]
const PLAN_FILTER = [{ value: '', label: 'All Plans' }, { value: 'basic', label: 'Basic' }, { value: 'pro', label: 'Pro' }, { value: 'elite', label: 'Elite' }]
const STATUS_BADGE: Record<string, string> = { SUCCESS: 'green', FAILED: 'red', PENDING: 'gold' }
const PLAN_BADGE: Record<string, string> = { free: 'gray', basic: 'blue', pro: 'gold', elite: 'purple' }

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [plan, setPlan] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', page, status, plan],
    queryFn: () => apiClient.admin.getPayments({ page, limit: 20, status: status || undefined, plan: plan || undefined }).then((r) => r.data),
    staleTime: 15_000,
  })
  const payments = data?.payments || []
  const totalPages = data?.total_pages || 1

  return (
    <div className="fade-up">
      <div className="mb-6">
        <p className="label mb-1.5">Admin</p>
        <h1 className="display-md">Payments</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Select options={STATUS_FILTER} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} />
        <Select options={PLAN_FILTER} value={plan} onChange={(e) => { setPlan(e.target.value); setPage(1) }} />
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'var(--bg-hover)' }} />)}</div>
        ) : payments.length === 0 ? (
          <p className="body-sm text-center py-10">No payments found</p>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="data-table min-w-[640px]">
              <thead><tr><th>Order</th><th>User</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.order_id}>
                    <td className="mono text-xs" style={{ color: 'var(--text-3)' }}>{(p.order_id || '').slice(-10)}</td>
                    <td className="caption">{p.user_email || p.uid}</td>
                    <td><Badge variant={PLAN_BADGE[p.plan] || 'gray'}>{p.plan}</Badge></td>
                    <td className="mono font-semibold text-sm" style={{ color: 'var(--gold)' }}>{formatCurrency((p.amount || 0) / 100)}</td>
                    <td><Badge variant={STATUS_BADGE[p.status] || 'gray'}>{p.status}</Badge></td>
                    <td className="caption">{formatDate(p.date || p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="caption">Page {page} of {totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  )
}

