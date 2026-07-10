import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

const VARIANT_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  gray: { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-2)', border: 'var(--border-1)' },
  blue: { bg: 'rgba(59,130,246,0.12)', color: '#60A5FA', border: 'rgba(59,130,246,0.3)' },
  gold: { bg: 'var(--gold-dim)', color: 'var(--gold)', border: 'var(--border-gold)' },
  purple: { bg: 'rgba(167,139,250,0.12)', color: 'var(--purple)', border: 'rgba(167,139,250,0.3)' },
  green: { bg: 'rgba(34,197,94,0.12)', color: 'var(--green)', border: 'rgba(34,197,94,0.3)' },
  red: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'rgba(239,68,68,0.3)' },
}

export default function Badge({ variant = 'gray', children, className }: { variant?: string; children: ReactNode; className?: string }) {
  const s = VARIANT_STYLES[variant] || VARIANT_STYLES.gray
  return (
    <span className={cn('inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold', className)} style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {children}
    </span>
  )
}
