import { useAuthStore } from '@/store/authStore'
import { isPlanExpired, daysRemaining } from '@/lib/utils'

export function useAuth() {
  const state = useAuthStore()
  return {
    ...state,
    firebaseUser: state.uid ? { uid: state.uid } : null,
    isExpired: isPlanExpired(state.planExpiry),
    daysLeft: daysRemaining(state.planExpiry),
  }
}
