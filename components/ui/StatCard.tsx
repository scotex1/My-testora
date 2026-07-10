import { cn } from '@/lib/utils'

export default function StatCard({ label, value, sub, color = 'var(--text-1)', loading = false, className }: { label: string; value: string | number; sub?: string; color?: string; loading?: boolean; className?: string }) {
  return (
    <div className={cn('rounded-2xl p-4', className)} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-1)' }}>
      <p className="label mb-2">{label}</p>
      {loading ? (
        <div className="h-6 w-20 rounded animate-pulse" style={{ background: 'var(--bg-hover)' }} />
      ) : (
        <p className="text-xl font-bold mono" style={{ color }}>{value}</p>
      )}
      {sub && !loading && <p className="caption mt-1">{sub}</p>}
    </div>
  )
}
