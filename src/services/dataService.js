/**
 * Data service.
 *
 * Reads/writes the per-user document. Uses Firestore when configured, otherwise
 * a localStorage-backed store with a pub/sub layer so the UI stays reactive.
 *
 * Document shape (users/{uid}):
 * {
 *   profile: { displayName, email, country, city, createdAt },
 *   points: number,
 *   entries: [{ id, date, total, transport, energy, food, waste, score, inputs }],
 *   goals:   [{ id, title, category, baselineKg, targetKg, currentKg, completed, createdAt }],
 *   habitLog:{ 'YYYY-MM-DD': [habitId, ...] },
 *   challenges:[{ id, joinedAt, progress, completed }],
 * }
 */
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase/config'

const keyFor = (uid) => `ecotrack:data:${uid}`

export function emptyUserData(profile = {}) {
  return {
    profile: { country: '', city: '', ...profile },
    points: 0,
    entries: [],
    goals: [],
    habitLog: {},
    challenges: [],
  }
}

// --- demo pub/sub ---------------------------------------------------------
const demoSubs = new Map() // uid -> Set<cb>
function readDemo(uid) {
  try {
    const raw = localStorage.getItem(keyFor(uid))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function writeDemo(uid, data) {
  localStorage.setItem(keyFor(uid), JSON.stringify(data))
  const subs = demoSubs.get(uid)
  if (subs) subs.forEach((cb) => cb(data))
}

// --- low level ------------------------------------------------------------
export async function readUserData(uid) {
  if (isFirebaseConfigured) {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? snap.data() : null
  }
  return readDemo(uid)
}

export async function writeUserData(uid, data) {
  if (isFirebaseConfigured) {
    await setDoc(doc(db, 'users', uid), data, { merge: true })
    return data
  }
  writeDemo(uid, data)
  return data
}

export function subscribeUserData(uid, cb) {
  if (isFirebaseConfigured) {
    return onSnapshot(doc(db, 'users', uid), (snap) => {
      cb(snap.exists() ? snap.data() : null)
    })
  }
  if (!demoSubs.has(uid)) demoSubs.set(uid, new Set())
  demoSubs.get(uid).add(cb)
  Promise.resolve().then(() => cb(readDemo(uid)))
  return () => demoSubs.get(uid)?.delete(cb)
}

/** Ensure a user document exists; create it from profile if missing. */
export async function ensureUserData(uid, profile) {
  const existing = await readUserData(uid)
  if (existing) return existing
  const fresh = emptyUserData({
    displayName: profile?.displayName,
    email: profile?.email,
    createdAt: new Date().toISOString(),
  })
  await writeUserData(uid, fresh)
  return fresh
}

// --- mutations (read-modify-write) ---------------------------------------
async function mutate(uid, fn) {
  const current = (await readUserData(uid)) || emptyUserData()
  const next = fn(structuredCloneSafe(current)) || current
  await writeUserData(uid, next)
  return next
}

function structuredCloneSafe(obj) {
  try {
    return structuredClone(obj)
  } catch {
    return JSON.parse(JSON.stringify(obj))
  }
}

let idCounter = 0
function uid16() {
  idCounter += 1
  return `${Date.now().toString(36)}${idCounter}${Math.random().toString(36).slice(2, 6)}`
}

export function saveEntry(uid, entry) {
  return mutate(uid, (d) => {
    d.entries = d.entries || []
    d.entries.push({ id: uid16(), date: new Date().toISOString(), ...entry })
    d.points = (d.points || 0) + 50
    return d
  })
}

export function updateProfile(uid, patch) {
  return mutate(uid, (d) => {
    d.profile = { ...(d.profile || {}), ...patch }
    return d
  })
}

export function addGoal(uid, goal) {
  return mutate(uid, (d) => {
    d.goals = d.goals || []
    d.goals.push({
      id: uid16(),
      createdAt: new Date().toISOString(),
      completed: false,
      currentKg: goal.baselineKg,
      ...goal,
    })
    return d
  })
}

export function updateGoal(uid, goalId, patch) {
  return mutate(uid, (d) => {
    d.goals = (d.goals || []).map((g) => {
      if (g.id !== goalId) return g
      const updated = { ...g, ...patch }
      const justCompleted = !g.completed && updated.completed
      if (justCompleted) d.points = (d.points || 0) + 200
      return updated
    })
    return d
  })
}

export function deleteGoal(uid, goalId) {
  return mutate(uid, (d) => {
    d.goals = (d.goals || []).filter((g) => g.id !== goalId)
    return d
  })
}

export function toggleHabit(uid, date, habitId, points = 10) {
  return mutate(uid, (d) => {
    d.habitLog = d.habitLog || {}
    const day = d.habitLog[date] || []
    if (day.includes(habitId)) {
      d.habitLog[date] = day.filter((h) => h !== habitId)
      d.points = Math.max(0, (d.points || 0) - points)
    } else {
      d.habitLog[date] = [...day, habitId]
      d.points = (d.points || 0) + points
    }
    return d
  })
}

export function joinChallenge(uid, challengeId) {
  return mutate(uid, (d) => {
    d.challenges = d.challenges || []
    if (!d.challenges.some((c) => c.id === challengeId)) {
      d.challenges.push({
        id: challengeId,
        joinedAt: new Date().toISOString(),
        progress: 0,
        completed: false,
      })
    }
    return d
  })
}

export function updateChallenge(uid, challengeId, patch, awardPoints = 0) {
  return mutate(uid, (d) => {
    d.challenges = (d.challenges || []).map((c) => {
      if (c.id !== challengeId) return c
      const updated = { ...c, ...patch }
      if (!c.completed && updated.completed && awardPoints) {
        d.points = (d.points || 0) + awardPoints
      }
      return updated
    })
    return d
  })
}
