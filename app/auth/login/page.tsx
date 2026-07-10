'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      toast.error('Enter email and password')
      return
    }
    setLoading(true)
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)
      router.replace('/dashboard')
    } catch (err: any) {
      toast.error(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider())
      router.replace('/dashboard')
    } catch (err: any) {
      toast.error(err?.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full fade-up">
        <div className="mb-8 text-center">
          <Link href="/home" className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>FinVest</Link>
          <h1 className="display-md mt-3">Sign in</h1>
        </div>
        <Card>
          <div className="flex flex-col gap-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <Button onClick={handleLogin} loading={loading} className="w-full">Sign in</Button>
            <Button variant="outline" onClick={handleGoogle} loading={loading} className="w-full">Continue with Google</Button>
            <p className="caption text-center">
              Don&apos;t have an account? <Link href="/auth/signup" className="hover:underline" style={{ color: 'var(--gold)' }}>Sign up</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
