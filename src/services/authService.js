/**
 * Authentication service.
 *
 * Uses Firebase Authentication when configured, otherwise a localStorage-backed
 * demo implementation so the app works end-to-end without credentials.
 */
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase/config'

const DEMO_USERS_KEY = 'ecotrack:demo:users'
const DEMO_SESSION_KEY = 'ecotrack:demo:session'

// --- Demo helpers ---------------------------------------------------------
function loadDemoUsers() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '{}')
  } catch {
    return {}
  }
}
function saveDemoUsers(users) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}
function hash(str) {
  // Non-cryptographic hash — demo mode only, never used in production.
  let h = 0
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return String(h)
}
function makeUid() {
  return 'demo_' + Math.random().toString(36).slice(2, 11)
}

const demoListeners = new Set()
function getDemoSession() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_SESSION_KEY) || 'null')
  } catch {
    return null
  }
}
function setDemoSession(user) {
  if (user) localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user))
  else localStorage.removeItem(DEMO_SESSION_KEY)
  demoListeners.forEach((cb) => cb(user))
}

function friendlyError(err) {
  const code = err?.code || ''
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'That email address is invalid.',
    'auth/weak-password': 'Password is too weak (min 6 characters).',
    'auth/user-not-found': 'No account found with these credentials.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  }
  return new Error(map[code] || err?.message || 'Authentication failed.')
}

function normalizeUser(u) {
  return { uid: u.uid, email: u.email, displayName: u.displayName || u.email }
}

// --- Public API -----------------------------------------------------------
/** Subscribe to auth state. Returns a synchronous unsubscribe function. */
export function onAuthChange(callback) {
  if (isFirebaseConfigured) {
    return onAuthStateChanged(auth, (u) => callback(u ? normalizeUser(u) : null))
  }
  // Emit current session asynchronously to mirror Firebase behaviour.
  Promise.resolve().then(() => callback(getDemoSession()))
  demoListeners.add(callback)
  return () => demoListeners.delete(callback)
}

export async function signUp(email, password, displayName) {
  if (isFirebaseConfigured) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) await updateProfile(cred.user, { displayName })
      return { uid: cred.user.uid, email: cred.user.email, displayName }
    } catch (err) {
      throw friendlyError(err)
    }
  }
  const users = loadDemoUsers()
  const key = email.toLowerCase()
  if (users[key]) throw new Error('An account with this email already exists.')
  const user = { uid: makeUid(), email: key, displayName: displayName || key }
  users[key] = { ...user, pw: hash(password) }
  saveDemoUsers(users)
  setDemoSession(user)
  return user
}

export async function signIn(email, password) {
  if (isFirebaseConfigured) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      return normalizeUser(cred.user)
    } catch (err) {
      throw friendlyError(err)
    }
  }
  const users = loadDemoUsers()
  const key = email.toLowerCase()
  const rec = users[key]
  if (!rec || rec.pw !== hash(password)) {
    throw new Error('Incorrect email or password.')
  }
  const user = { uid: rec.uid, email: rec.email, displayName: rec.displayName }
  setDemoSession(user)
  return user
}

export async function signOutUser() {
  if (isFirebaseConfigured) return signOut(auth)
  setDemoSession(null)
}
