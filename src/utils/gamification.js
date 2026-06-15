/**
 * Gamification: eco points, green levels, badges and streak helpers.
 */

export const GREEN_LEVELS = [
  { key: 'beginner', name: 'Beginner Eco Hero', minPoints: 0, icon: '🌱' },
  { key: 'explorer', name: 'Green Explorer', minPoints: 250, icon: '🌿' },
  { key: 'champion', name: 'Sustainability Champion', minPoints: 750, icon: '🍃' },
  { key: 'guardian', name: 'Climate Guardian', minPoints: 1500, icon: '🌳' },
  { key: 'protector', name: 'Earth Protector', minPoints: 3000, icon: '🌍' },
]

/** Resolve the level object + progress toward the next level for a point total. */
export function getLevel(points = 0) {
  const p = Math.max(0, Number(points) || 0)
  let current = GREEN_LEVELS[0]
  for (const level of GREEN_LEVELS) {
    if (p >= level.minPoints) current = level
  }
  const idx = GREEN_LEVELS.indexOf(current)
  const next = GREEN_LEVELS[idx + 1] || null
  const progress = next
    ? Math.min(
        100,
        Math.round(((p - current.minPoints) / (next.minPoints - current.minPoints)) * 100),
      )
    : 100
  return { current, next, progress, level: idx + 1, points: p }
}

/**
 * Badge catalogue. `check` receives a stats object and returns a boolean.
 */
export const BADGES = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Logged your first carbon footprint',
    icon: '👣',
    check: (s) => (s.entries || 0) >= 1,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintained a 7-day green streak',
    icon: '🔥',
    check: (s) => (s.currentStreak || 0) >= 7,
  },
  {
    id: 'streak-30',
    name: 'Habit Master',
    description: '30-day green streak',
    icon: '⚡',
    check: (s) => (s.longestStreak || 0) >= 30,
  },
  {
    id: 'goal-getter',
    name: 'Goal Getter',
    description: 'Completed a carbon reduction goal',
    icon: '🎯',
    check: (s) => (s.goalsCompleted || 0) >= 1,
  },
  {
    id: 'green-machine',
    name: 'Green Machine',
    description: 'Reached a sustainability score of 80+',
    icon: '💚',
    check: (s) => (s.bestScore || 0) >= 80,
  },
  {
    id: 'tree-hugger',
    name: 'Tree Hugger',
    description: 'Offset enough to plant 50 trees',
    icon: '🌳',
    check: (s) => (s.treesOffset || 0) >= 50,
  },
  {
    id: 'point-collector',
    name: 'Point Collector',
    description: 'Earned 1,000 eco points',
    icon: '🏆',
    check: (s) => (s.points || 0) >= 1000,
  },
  {
    id: 'challenger',
    name: 'Challenger',
    description: 'Completed 3 weekly challenges',
    icon: '🥇',
    check: (s) => (s.challengesCompleted || 0) >= 3,
  },
]

/** Return the list of badges earned given a stats object. */
export function evaluateBadges(stats = {}) {
  return BADGES.map((b) => ({ ...b, earned: !!b.check(stats) }))
}

/** Points awarded for various actions. */
export const POINT_VALUES = {
  logFootprint: 50,
  completeHabit: 10,
  completeChallenge: 100,
  completeGoal: 200,
  streakBonus: 5, // per consecutive day
}

/**
 * Compute current/longest streak from an array of ISO date strings (YYYY-MM-DD).
 */
export function computeStreak(dates = []) {
  if (!dates.length) return { currentStreak: 0, longestStreak: 0 }
  const unique = [...new Set(dates)].sort()
  let longest = 1
  let run = 1
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1])
    const cur = new Date(unique[i])
    const diff = Math.round((cur - prev) / 86400000)
    if (diff === 1) {
      run += 1
      longest = Math.max(longest, run)
    } else if (diff > 1) {
      run = 1
    }
  }

  // Current streak: walk back from today.
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const set = new Set(unique)
  let current = 0
  const cursor = new Date(today)
  // Allow the streak to count if the most recent log was today or yesterday.
  const todayStr = toISODate(today)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (!set.has(todayStr) && !set.has(toISODate(yesterday))) {
    return { currentStreak: 0, longestStreak: longest }
  }
  if (!set.has(todayStr)) cursor.setDate(cursor.getDate() - 1)
  while (set.has(toISODate(cursor))) {
    current += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return { currentStreak: current, longestStreak: Math.max(longest, current) }
}

export function toISODate(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}
