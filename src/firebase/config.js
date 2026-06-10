/**
 * Firebase initialisation.
 *
 * Reads configuration from Vite environment variables (see .env.example).
 * If the required variables are missing the app falls back to "demo mode"
 * (localStorage-backed auth + data), so the project runs and is testable
 * without real Firebase credentials. Provide credentials in production.
 */
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

let app = null
let auth = null
let db = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
} else if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[EcoTrack AI] Firebase env vars not found — running in demo mode (localStorage). ' +
      'Create a .env file from .env.example to enable Firebase.',
  )
}

export { app, auth, db }
