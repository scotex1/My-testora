import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyD4aN6sNxuY91OpCzRhIslvCXYWSKJ5PNM",
  authDomain: "planning-with-ai-67a76.firebaseapp.com",
  projectId: "planning-with-ai-67a76",
  storageBucket: "planning-with-ai-67a76.firebasestorage.app",
  messagingSenderId: "250873437317",
  appId: "1:250873437317:web:276c5df31d26b399495dec"
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
