import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Singleton — prevents "Firebase App already exists" on Next.js hot-reload.
function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
}

// getAuth() deferred until first real (client-side) use. Calling it eagerly
// at module scope would crash `next build` whenever NEXT_PUBLIC_FIREBASE_*
// env vars are absent, because Next evaluates this module while building
// the shared server shell even for routes that never render on the server.
let _auth: Auth | null = null
export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(getFirebaseApp())
  return _auth
}

export default getFirebaseApp
