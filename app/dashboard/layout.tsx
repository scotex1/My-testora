import AuthGuard from '@/components/AuthGuard'
import ProfileSync from '@/components/ProfileSync'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ProfileSync />
      <Navbar />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </AuthGuard>
  )
}
