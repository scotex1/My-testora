import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export default function Card({ children, gold = false, className }: { children: ReactNode; gold?: boolean; className?: string }) {
  return (
    <div
      className={cn('rounded-2xl p-6', className)}
      style={{
        background: gold ? 'linear-gradient(135deg, rgba(212,168,83,0.08), var(--bg-raised))' : 'var(--bg-raised)',
        border: `1px solid ${gold ? 'var(--border-gold)' : 'var(--border-1)'}`,
      }}
    >
      {children}
    </div>
  )
}
