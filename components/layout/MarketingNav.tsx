'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

const LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact' },
]

export default function MarketingNav() {
  const pathname = usePathname()
  const { uid } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: 'rgba(11,13,16,0.85)', borderBottom: '1px solid var(--border-1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/home" className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
          FinVest
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn('text-sm font-medium transition-colors', pathname === l.href ? '' : 'hover:opacity-80')}
              style={{ color: pathname === l.href ? 'var(--gold)' : 'var(--text-2)' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {uid ? (
            <Link href="/dashboard"><Button size="sm">Dashboard</Button></Link>
          ) : (
            <>
              <Link href="/auth/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link href="/auth/signup"><Button size="sm">Get Started</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden text-2xl" style={{ color: 'var(--text-1)' }} onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? '×' : '☰'}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border-1)' }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm py-2" style={{ color: 'var(--text-2)' }} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {uid ? (
            <Link href="/dashboard"><Button size="sm" className="w-full">Dashboard</Button></Link>
          ) : (
            <>
              <Link href="/auth/login"><Button variant="outline" size="sm" className="w-full">Sign in</Button></Link>
              <Link href="/auth/signup"><Button size="sm" className="w-full">Get Started</Button></Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
