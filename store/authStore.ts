import { create } from 'zustand'

const PLAN_LABELS: Record<string, string> = { free: 'Free', basic: 'Basic', pro: 'Pro', elite: 'Elite' }

interface Profile {
  name: string | null
  email: string | null
  photo: string | null
  plan: string
  plan_expiry: string | null
}

interface AuthState {
  uid: string | null
  authLoading: boolean
  profileLoading: boolean
  name: string | null
  email: string | null
  photo: string | null
  plan: string
  planName: string
  planExpiry: string | null
  isAdmin: boolean
  setFirebaseUser: (uid: string | null) => void
  setAuthLoading: (v: boolean) => void
  setProfile: (p: Partial<Profile> & { is_admin?: boolean }) => void
  setProfileLoading: (v: boolean) => void
  reset: () => void
}

const initialState = {
  uid: null,
  authLoading: true,
  profileLoading: false,
  name: null,
  email: null,
  photo: null,
  plan: 'free',
  planName: 'Free',
  planExpiry: null,
  isAdmin: false,
}

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  setFirebaseUser: (uid) => set({ uid }),
  setAuthLoading: (v) => set({ authLoading: v }),
  setProfileLoading: (v) => set({ profileLoading: v }),
  setProfile: (p) =>
    set((state) => {
      const plan = p.plan ?? state.plan
      return {
        name: p.name ?? state.name,
        email: p.email ?? state.email,
        photo: p.photo ?? state.photo,
        plan,
        planName: PLAN_LABELS[plan] || 'Free',
        planExpiry: p.plan_expiry ?? state.planExpiry,
        isAdmin: p.is_admin ?? state.isAdmin,
      }
    }),
  reset: () => set(initialState),
}))
