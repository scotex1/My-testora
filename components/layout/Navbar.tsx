'use client'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import Badge from '@/components/ui/Badge'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const PLAN_BADGE: Record<string, string> = { free: 'gray', basic: 'blue', pro: 'gold', elite: 'purple' }

export default function Navbar() {
  const { name, photo, plan, planName } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(getFirebaseAuth())
      router.replace('/auth/login')
    } catch (err: any) {
      toast.error(err?.message || 'Logout failed')
    }
  }

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 sm:px-6" style={{ background: 'rgba(11,13,16,0.9)', borderBottom: '1px solid var(--border-1)', backdropFilter: 'blur(8px)' }}>
      <Link href="/dashboard" className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
        FinVest
      </Link>

      <div className="flex items-center gap-4">
        <Badge variant={PLAN_BADGE[plan] || 'gray'} className="hidden sm:inline-flex">{planName}</Badge>
        <Link href="/dashboard/profile" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold overflow-hidden" style={{ background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}>
            {photo ? <img src={photo} alt={name || ''} className="w-full h-full object-cover" /> : (name || 'U')[0]?.toUpperCase()}
          </div>
        </Link>
        <button onClick={handleLogout} className="caption hover:underline">Sign out</button>
      </div>
    </header>
  )
}
