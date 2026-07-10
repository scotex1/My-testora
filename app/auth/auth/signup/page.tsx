'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)
      await updateProfile(cred.user, { displayName: name.trim() })
      router.replace('/dashboard')
    } catch (err: any) {
      toast.error(err?.message || 'Sign up failed')
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
          <h1 className="display-md mt-3">Create your account</h1>
        </div>
        <Card>
          <div className="flex flex-col gap-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
            <Button onClick={handleSignup} loading={loading} className="w-full">Create Account</Button>
            <Button variant="outline" onClick={handleGoogle} loading={loading} className="w-full">Continue with Google</Button>
            <p className="caption text-center">
              Already have an account? <Link href="/auth/login" className="hover:underline" style={{ color: 'var(--gold)' }}>Sign in</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
