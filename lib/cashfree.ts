import { load, type Cashfree } from '@cashfreepayments/cashfree-js'

const mode = (process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'production' : 'sandbox') as
  | 'sandbox'
  | 'production'

let _cashfreePromise: Promise<Cashfree> | null = null

/**
 * Lazily loads the Cashfree JS SDK (fetches their script under the hood).
 * Only call this from client-side event handlers — never at module scope —
 * same reasoning as getFirebaseAuth() in lib/firebase.ts: calling an SDK
 * loader eagerly at import time can break SSR/build.
 */
export function getCashfree(): Promise<Cashfree> {
  if (!_cashfreePromise) _cashfreePromise = load({ mode })
  return _cashfreePromise
}
