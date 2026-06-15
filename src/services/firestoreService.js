import {
  doc, collection, setDoc, updateDoc, getDoc, getDocs,
  addDoc, deleteDoc, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, increment, writeBatch,
  runTransaction, arrayUnion, arrayRemove, Timestamp,
  getCountFromServer
} from 'firebase/firestore'
import { db } from '../lib/firebase'

// ─── Collections ─────────────────────────────────────────────────────────────
export const COLLECTIONS = {
  USERS: 'users',
  CALCULATIONS: 'calculations',
  HABITS: 'habits',
  CHALLENGES: 'challenges',
  CHALLENGE_PARTICIPANTS: 'challengeParticipants',
  LEADERBOARD: 'leaderboard',
  COUNTRY_STATS: 'countryStats',
  CHAT_MESSAGES: 'chatMessages',
  NOTIFICATIONS: 'notifications',
  STREAKS: 'streaks',
  MARKETPLACE_ORDERS: 'marketplaceOrders',
}

// ─── User Profile ─────────────────────────────────────────────────────────────
export async function createUserProfile(uid, data) {
  const ref = doc(db, COLLECTIONS.USERS, uid)
  const profile = {
    uid,
    name: data.name || 'Eco User',
    email: data.email || '',
    photoURL: data.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
    location: data.location || 'India',
    country: data.country || 'India',
    city: data.city || 'Mumbai',
    bio: '',
    ecoLevel: 1,
    ecoLevelName: 'Beginner Eco Hero',
    ecoPoints: 0,
    totalCO2Saved: 0,
    carbonScore: 0,
    sustainabilityScore: 0,
    globalRank: 999999,
    currentStreak: 0,
    longestStreak: 0,
    completedChallenges: 0,
    joinedChallenges: [],
    achievements: [],
    preferences: { theme: 'dark', notifications: true, emailReports: true },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
  }
  await setDoc(ref, profile, { merge: true })
  return profile
}

export function subscribeToUserProfile(uid, callback) {
  const ref = doc(db, COLLECTIONS.USERS, uid)
  return onSnapshot(ref, snap => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() })
  })
}

export async function updateUserProfile(uid, updates) {
  const ref = doc(db, COLLECTIONS.USERS, uid)
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() })
}

// ─── Carbon Calculations ──────────────────────────────────────────────────────
export async function saveCalculation(uid, calcData) {
  const batch = writeBatch(db)

  // Save calculation
  const calcRef = doc(collection(db, COLLECTIONS.CALCULATIONS))
  batch.set(calcRef, {
    uid,
    ...calcData,
    createdAt: serverTimestamp(),
  })

  // Update user's latest carbon score and country stats
  const userRef = doc(db, COLLECTIONS.USERS, uid)
  batch.update(userRef, {
    carbonScore: calcData.totalTonnes,
    lastCalculatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  // Update leaderboard entry
  const lbRef = doc(db, COLLECTIONS.LEADERBOARD, uid)
  batch.set(lbRef, {
    uid,
    name: calcData.userName,
    photoURL: calcData.userPhoto,
    country: calcData.country,
    city: calcData.city,
    carbonScore: calcData.totalTonnes,
    ecoPoints: calcData.ecoPoints || 0,
    sustainabilityScore: calcData.sustainabilityScore || 0,
    updatedAt: serverTimestamp(),
  }, { merge: true })

  await batch.commit()
  return calcRef.id
}

export function subscribeToUserCalculations(uid, callback) {
  const q = query(
    collection(db, COLLECTIONS.CALCULATIONS),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(12)
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// ─── Real-time Leaderboard ────────────────────────────────────────────────────
export function subscribeToGlobalLeaderboard(callback, count = 20) {
  const q = query(
    collection(db, COLLECTIONS.LEADERBOARD),
    orderBy('ecoPoints', 'desc'),
    limit(count)
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map((d, i) => ({ rank: i + 1, id: d.id, ...d.data() })))
  })
}

export function subscribeToCountryLeaderboard(country, callback, count = 20) {
  const q = query(
    collection(db, COLLECTIONS.LEADERBOARD),
    where('country', '==', country),
    orderBy('ecoPoints', 'desc'),
    limit(count)
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map((d, i) => ({ rank: i + 1, id: d.id, ...d.data() })))
  })
}

export async function getUserGlobalRank(uid) {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.LEADERBOARD, uid))
    if (!userDoc.exists()) return null
    const userPoints = userDoc.data().ecoPoints || 0
    const q = query(
      collection(db, COLLECTIONS.LEADERBOARD),
      where('ecoPoints', '>', userPoints)
    )
    const snap = await getCountFromServer(q)
    return snap.data().count + 1
  } catch { return null }
}

// ─── Country Stats ────────────────────────────────────────────────────────────
export async function updateCountryStats(country, city, carbonScore) {
  try {
    const ref = doc(db, COLLECTIONS.COUNTRY_STATS, country.replace(/\s+/g, '_'))
    await setDoc(ref, {
      country,
      totalUsers: increment(1),
      totalCO2: increment(carbonScore),
      updatedAt: serverTimestamp(),
    }, { merge: true })

    if (city) {
      const cityRef = doc(db, COLLECTIONS.COUNTRY_STATS, `${country}_${city}`.replace(/\s+/g, '_'))
      await setDoc(cityRef, {
        country, city,
        totalUsers: increment(1),
        totalCO2: increment(carbonScore),
        updatedAt: serverTimestamp(),
      }, { merge: true })
    }
  } catch (e) { console.error('updateCountryStats:', e) }
}

export function subscribeToCountryStats(callback) {
  const q = query(collection(db, COLLECTIONS.COUNTRY_STATS), orderBy('totalUsers', 'desc'), limit(20))
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// ─── Habits & Streaks ─────────────────────────────────────────────────────────
export async function logHabit(uid, habit, dateStr) {
  const ref = doc(db, COLLECTIONS.HABITS, `${uid}_${dateStr}_${habit.id}`)
  await setDoc(ref, {
    uid,
    habitId: habit.id,
    habitName: habit.name,
    category: habit.category,
    points: habit.points,
    co2Saved: habit.co2Saved || 0,
    date: dateStr,
    completedAt: serverTimestamp(),
  })
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    ecoPoints: increment(habit.points),
    totalCO2Saved: increment(habit.co2Saved || 0),
    updatedAt: serverTimestamp(),
  })
  await updateDoc(doc(db, COLLECTIONS.LEADERBOARD, uid), {
    ecoPoints: increment(habit.points),
    updatedAt: serverTimestamp(),
  }).catch(() => {})
}

export async function removeHabit(uid, habit, dateStr) {
  const ref = doc(db, COLLECTIONS.HABITS, `${uid}_${dateStr}_${habit.id}`)
  await deleteDoc(ref)
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    ecoPoints: increment(-habit.points),
    totalCO2Saved: increment(-(habit.co2Saved || 0)),
    updatedAt: serverTimestamp(),
  })
}

export function subscribeToDayHabits(uid, dateStr, callback) {
  const q = query(
    collection(db, COLLECTIONS.HABITS),
    where('uid', '==', uid),
    where('date', '==', dateStr)
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => d.data().habitId))
  })
}

export function subscribeToStreakData(uid, callback) {
  const ref = doc(db, COLLECTIONS.STREAKS, uid)
  return onSnapshot(ref, snap => {
    if (snap.exists()) callback(snap.data())
    else callback({ currentStreak: 0, longestStreak: 0, lastActiveDate: null })
  })
}

export async function updateStreak(uid, streakData) {
  const ref = doc(db, COLLECTIONS.STREAKS, uid)
  await setDoc(ref, { uid, ...streakData, updatedAt: serverTimestamp() }, { merge: true })
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    updatedAt: serverTimestamp(),
  })
}

// ─── Challenges ───────────────────────────────────────────────────────────────
export function subscribeToChallenges(callback) {
  const q = query(collection(db, COLLECTIONS.CHALLENGES), orderBy('participants', 'desc'))
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

export async function joinChallenge(uid, challengeId, userName, userPhoto) {
  const batch = writeBatch(db)
  const participantRef = doc(db, COLLECTIONS.CHALLENGE_PARTICIPANTS, `${challengeId}_${uid}`)
  batch.set(participantRef, {
    uid, challengeId, userName, userPhoto,
    progress: 0, joinedAt: serverTimestamp(),
  })
  const challengeRef = doc(db, COLLECTIONS.CHALLENGES, challengeId)
  batch.update(challengeRef, {
    participants: increment(1),
    updatedAt: serverTimestamp(),
  })
  const userRef = doc(db, COLLECTIONS.USERS, uid)
  batch.update(userRef, {
    joinedChallenges: arrayUnion(challengeId),
    updatedAt: serverTimestamp(),
  })
  await batch.commit()
}

export function subscribeToChallengePlayers(challengeId, callback, count = 10) {
  const q = query(
    collection(db, COLLECTIONS.CHALLENGE_PARTICIPANTS),
    where('challengeId', '==', challengeId),
    orderBy('progress', 'desc'),
    limit(count)
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map((d, i) => ({ rank: i + 1, ...d.data() })))
  })
}

// ─── Notifications ────────────────────────────────────────────────────────────
export async function createNotification(uid, notification) {
  await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
    uid,
    ...notification,
    read: false,
    createdAt: serverTimestamp(),
  })
}

export function subscribeToNotifications(uid, callback) {
  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('uid', '==', uid),
    where('read', '==', false),
    orderBy('createdAt', 'desc'),
    limit(10)
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

export async function markNotificationRead(notifId) {
  await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notifId), { read: true })
}

// ─── Chat Messages ────────────────────────────────────────────────────────────
export async function saveChatMessage(uid, message) {
  const ref = doc(collection(db, COLLECTIONS.CHAT_MESSAGES))
  await setDoc(ref, {
    uid,
    ...message,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export function subscribeToChat(uid, callback) {
  const q = query(
    collection(db, COLLECTIONS.CHAT_MESSAGES),
    where('uid', '==', uid),
    orderBy('createdAt', 'asc'),
    limit(50)
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// ─── Analytics aggregations ──────────────────────────────────────────────────
export async function getPlatformStats() {
  try {
    const usersSnap = await getCountFromServer(collection(db, COLLECTIONS.USERS))
    const calcsSnap = await getCountFromServer(collection(db, COLLECTIONS.CALCULATIONS))
    return {
      totalUsers: usersSnap.data().count,
      totalCalculations: calcsSnap.data().count,
    }
  } catch {
    return { totalUsers: 0, totalCalculations: 0 }
  }
}

// ─── Seed initial challenges (run once) ──────────────────────────────────────
export async function seedChallenges() {
  const challenges = [
    { title: 'Plastic-Free July', category: 'Recycling', description: 'Avoid all single-use plastic for 30 days', participants: 0, duration: '30 days', difficulty: 'Medium', points: 500, co2Impact: 45, badge: '🚫', color: 'blue', daysLeft: 30, tags: ['ZeroWaste', 'PlasticFree'] },
    { title: '30-Day Public Transport', category: 'Transport', description: 'Use only public transit or cycling for a month', participants: 0, duration: '30 days', difficulty: 'Hard', points: 750, co2Impact: 120, badge: '🚌', color: 'green', daysLeft: 30, tags: ['Transport', 'Active'] },
    { title: 'Plant 10 Trees', category: 'Nature', description: 'Plant or sponsor 10 trees in your community', participants: 0, duration: '1 month', difficulty: 'Easy', points: 400, co2Impact: 500, badge: '🌳', color: 'green', daysLeft: 30, tags: ['Nature', 'Community'] },
    { title: 'Energy Saving Sprint', category: 'Energy', description: 'Reduce household energy by 20% for 2 weeks', participants: 0, duration: '14 days', difficulty: 'Medium', points: 350, co2Impact: 85, badge: '⚡', color: 'yellow', daysLeft: 14, tags: ['Energy', 'Home'] },
    { title: 'Vegan Week', category: 'Food', description: 'Go fully plant-based for 7 days', participants: 0, duration: '7 days', difficulty: 'Medium', points: 250, co2Impact: 28, badge: '🥗', color: 'purple', daysLeft: 7, tags: ['Food', 'Health'] },
    { title: 'Zero Waste Kitchen', category: 'Waste', description: 'Compost all food waste and eliminate kitchen plastic', participants: 0, duration: '14 days', difficulty: 'Hard', points: 450, co2Impact: 35, badge: '🌿', color: 'green', daysLeft: 14, tags: ['Kitchen', 'Compost'] },
  ]

  const batch = writeBatch(db)
  for (const ch of challenges) {
    const ref = doc(collection(db, COLLECTIONS.CHALLENGES))
    batch.set(ref, { ...ch, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  }
  await batch.commit()
}
