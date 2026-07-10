'use client'
import { usePathname } from 'next/navigation'
import EngineGuard from '@/components/EngineGuard'
import ProfileSync from '@/components/ProfileSync'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'

export default function EnginesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const engineId = pathname.split('/')[2] || ''

  return (
    <>
      <ProfileSync />
      <Navbar />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <EngineGuard engineId={engineId}>{children}</EngineGuard>
        </div>
      </div>
    </>
  )
}
