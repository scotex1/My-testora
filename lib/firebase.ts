import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBsAEpp3hooCCHYEdmTNqTId9aWK0a69Ms",
  authDomain: "ai-vit-52666.firebaseapp.com",
  projectId: "ai-vit-52666",
  storageBucket: "ai-vit-52666.firebasestorage.app",
  messagingSenderId: "137839510307",
  appId: "1:137839510307:web:c8f56f623c8234b4638296",
  measurementId: "G-CDTY9LJLC7"
};

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
