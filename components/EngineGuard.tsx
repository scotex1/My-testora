'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { hasAccess } from '@/lib/utils'
import AuthGuard from './AuthGuard'

function EngineCheck({ engineId, children }: { engineId: string; children: React.ReactNode }) {
  const { plan, planExpiry, profileLoading } = useAuth()
  const router = useRouter()
  const access = hasAccess(engineId, plan, planExpiry)

  useEffect(() => {
    if (!profileLoading && !access) router.replace('/pricing')
  }, [profileLoading, access, router])

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="inline-block w-6 h-6 rounded-full border-2 border-current border-t-transparent animate-spin" style={{ color: 'var(--gold)' }} aria-label="Loading" />
      </div>
    )
  }

  if (!access) return null

  return <>{children}</>
}

export default function EngineGuard({ engineId, children }: { engineId: string; children: React.ReactNode }) {
  return (
    <AuthGuard>
      <EngineCheck engineId={engineId}>{children}</EngineCheck>
    </AuthGuard>
  )
}
