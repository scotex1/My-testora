'use client'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'

/**
 * Mounted globally (in app/providers.tsx) so every page — including public
 * marketing pages — knows whether someone is logged in (e.g. MarketingNav
 * shows "Dashboard" vs "Sign in"). This ONLY talks to Firebase, never to
 * our own backend, so it never triggers CORS/network errors on pages that
 * don't need backend data. The backend profile sync (syncUser/getProfile)
 * lives in ProfileSync.tsx and is mounted only inside protected layouts.
 */
export default function AuthInitializer() {
  const setFirebaseUser = useAuthStore((s) => s.setFirebaseUser)
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading)
  const setProfile = useAuthStore((s) => s.setProfile)
  const reset = useAuthStore((s) => s.reset)

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (!user) {
        reset()
        setAuthLoading(false)
        return
      }
      setFirebaseUser(user.uid)
      setProfile({ name: user.displayName, email: user.email, photo: user.photoURL })
      setAuthLoading(false)
    })
    return () => unsub()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
