'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn, ENGINES, hasAccess } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const CORE_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
  { href: '/dashboard/subscription', label: 'Subscription', icon: '💳' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { plan, planExpiry, isAdmin } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 p-4 gap-6 overflow-y-auto" style={{ borderRight: '1px solid var(--border-1)' }}>
      <div>
        <p className="label mb-2 px-2">Menu</p>
        <nav className="flex flex-col gap-1">
          {CORE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: pathname === l.href ? 'var(--gold-dim)' : 'transparent',
                color: pathname === l.href ? 'var(--gold)' : 'var(--text-2)',
              }}
            >
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <p className="label mb-2 px-2">AI Engines</p>
        <nav className="flex flex-col gap-1">
          {ENGINES.map((e) => {
            const access = hasAccess(e.id, plan, planExpiry)
            const active = pathname === `/engines/${e.id}`
            return (
              <Link
                key={e.id}
                href={access ? `/engines/${e.id}` : '/pricing'}
                className={cn('flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-colors', !access && 'opacity-50')}
                style={{ background: active ? 'var(--gold-dim)' : 'transparent', color: active ? 'var(--gold)' : 'var(--text-2)' }}
              >
                <span>{e.icon}</span>{e.name}
                {!access && <span className="ml-auto text-xs">🔒</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {isAdmin && process.env.NEXT_PUBLIC_ADMIN_URL && (
        <div>
          <p className="label mb-2 px-2">Admin</p>
          <nav className="flex flex-col gap-1">
            <a href={process.env.NEXT_PUBLIC_ADMIN_URL} target="_blank" rel="noopener noreferrer" className="px-2.5 py-2 rounded-xl text-sm font-medium" style={{ color: 'var(--text-2)' }}>
              ⚙ Admin Panel ↗
            </a>
          </nav>
        </div>
      )}
    </aside>
  )
}
