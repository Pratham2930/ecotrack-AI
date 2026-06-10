import { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext, UserDataContext } from './contexts'
import { emptyUserData, subscribeUserData } from '../services/dataService'
import { computeStreak, evaluateBadges, getLevel } from '../utils/gamification'
import { offsetEquivalents, sustainabilityScore } from '../utils/carbon'

export function UserDataProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trackedUser, setTrackedUser] = useState(user)

  // Reset data during render when the authenticated user changes — this avoids
  // a synchronous setState inside the subscription effect (cascading renders).
  if (trackedUser !== user) {
    setTrackedUser(user)
    setData(null)
    setLoading(!!user)
  }

  useEffect(() => {
    if (!user) return undefined
    const unsub = subscribeUserData(user.uid, (d) => {
      setData(d || emptyUserData({ displayName: user.displayName, email: user.email }))
      setLoading(false)
    })
    return () => unsub && unsub()
  }, [user])

  // Derived, memoised stats consumed across the app.
  const derived = useMemo(() => {
    const d = data || emptyUserData()
    const entries = [...(d.entries || [])].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    )
    const latest = entries[entries.length - 1] || null
    const totalMonthly = latest?.total || 0
    const score = latest ? latest.score ?? sustainabilityScore(totalMonthly) : 0
    const bestScore = entries.reduce((m, e) => Math.max(m, e.score || 0), 0)
    const offsets = offsetEquivalents(totalMonthly)
    const habitDates = Object.keys(d.habitLog || {}).filter(
      (day) => (d.habitLog[day] || []).length > 0,
    )
    const streak = computeStreak(habitDates)
    const goalsCompleted = (d.goals || []).filter((g) => g.completed).length
    const challengesCompleted = (d.challenges || []).filter((c) => c.completed).length
    const points = d.points || 0
    const level = getLevel(points)
    const stats = {
      entries: entries.length,
      points,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      goalsCompleted,
      challengesCompleted,
      bestScore,
      treesOffset: offsets.treesNeeded,
    }
    const badges = evaluateBadges(stats)
    return {
      entries,
      latest,
      totalMonthly,
      score,
      bestScore,
      offsets,
      streak,
      level,
      points,
      stats,
      badges,
      goals: d.goals || [],
      challenges: d.challenges || [],
      habitLog: d.habitLog || {},
      profile: d.profile || {},
    }
  }, [data])

  const value = useMemo(
    () => ({ data, loading, ...derived }),
    [data, loading, derived],
  )

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
}
