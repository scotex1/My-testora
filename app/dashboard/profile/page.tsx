'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { name, email, photo, plan, planName, planExpiry, isExpired, daysLeft } = useAuth()
  const [form, setForm] = useState({ name: name || '', phone: '', city: '', occupation: '' })
  const [loading, setLoading] = useState(false)
  const nameHydrated = useRef(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    if (name && !nameHydrated.current) {
      setForm((f) => ({ ...f, name }))
      nameHydrated.current = true
    }
  }, [name])

  const planBadge: Record<string, string> = { free: 'gray', basic: 'blue', pro: 'gold', elite: 'purple' }

  const save = async () => {
    setLoading(true)
    try {
      await apiClient.updateProfile(form)
      toast.success('Profile updated successfully')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl fade-up pb-24 md:pb-0">
      <div className="mb-8">
        <p className="label mb-1.5">Account</p>
        <h1 className="display-md">Your Profile</h1>
      </div>

      <div className="flex items-center gap-5 p-6 rounded-2xl mb-6" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-1)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0" style={{ background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>
          {photo ? <img src={photo} alt={name || ''} className="w-full h-full rounded-2xl object-cover" /> : (name || 'U')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-lg truncate" style={{ color: 'var(--text-1)' }}>{name}</p>
          <p className="caption truncate mb-2">{email}</p>
          <Badge variant={planBadge[plan] || 'gray'}>{planName}</Badge>
        </div>
        <Link href="/pricing" className="shrink-0"><Button variant="outline" size="sm">{plan === 'free' ? 'Upgrade' : 'Manage'}</Button></Link>
      </div>

      {plan !== 'free' && (
        <div className="flex items-center justify-between p-5 rounded-2xl mb-6" style={{
          background: isExpired ? 'var(--red-dim)' : daysLeft <= 7 ? 'rgba(212,168,83,0.06)' : 'var(--bg-raised)',
          border: `1px solid ${isExpired ? 'rgba(239,68,68,0.2)' : daysLeft <= 7 ? 'var(--border-gold)' : 'var(--border-1)'}`,
        }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{isExpired ? 'Plan expired' : `${daysLeft} days remaining`}</p>
            <p className="caption">{planExpiry ? `Expires ${formatDate(planExpiry)}` : ''}</p>
          </div>
          {(isExpired || daysLeft <= 14) && <Link href="/pricing"><Button size="sm">{isExpired ? 'Renew now' : 'Renew'}</Button></Link>}
        </div>
      )}

      <Card>
        <h2 className="title-sm mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Input label="Full Name" value={form.name} onChange={set('name')} placeholder="Rahul Sharma" />
          <Input label="Phone Number" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
          <Input label="City" value={form.city} onChange={set('city')} placeholder="Mumbai" />
          <Input label="Occupation" value={form.occupation} onChange={set('occupation')} placeholder="Software Engineer" />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={save} loading={loading}>Save Changes</Button>
          <p className="caption">Changes apply immediately</p>
        </div>
      </Card>
    </div>
  )
}
