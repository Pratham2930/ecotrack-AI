import { describe, expect, it } from 'vitest'
import { computeStreak, evaluateBadges, getLevel, toISODate } from '../utils/gamification'

function daysAgo(n) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - n)
  return toISODate(d)
}

describe('getLevel', () => {
  it('resolves the correct green level for a point total', () => {
    expect(getLevel(0).current.key).toBe('beginner')
    expect(getLevel(300).current.key).toBe('explorer')
    expect(getLevel(5000).current.key).toBe('protector')
  })

  it('computes progress toward the next level', () => {
    const lvl = getLevel(250)
    expect(lvl.next.key).toBe('champion')
    expect(lvl.progress).toBeGreaterThanOrEqual(0)
    expect(lvl.progress).toBeLessThanOrEqual(100)
  })

  it('caps progress at the highest level', () => {
    expect(getLevel(10000).progress).toBe(100)
    expect(getLevel(10000).next).toBeNull()
  })
})

describe('computeStreak', () => {
  it('returns zero for empty input', () => {
    expect(computeStreak([])).toEqual({ currentStreak: 0, longestStreak: 0 })
  })

  it('counts consecutive days ending today', () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(2)]
    expect(computeStreak(dates).currentStreak).toBe(3)
  })

  it('breaks the current streak when the latest log is too old', () => {
    const dates = [daysAgo(5), daysAgo(6)]
    expect(computeStreak(dates).currentStreak).toBe(0)
    expect(computeStreak(dates).longestStreak).toBe(2)
  })
})

describe('evaluateBadges', () => {
  it('marks badges earned based on stats', () => {
    const badges = evaluateBadges({ entries: 1, currentStreak: 7, bestScore: 85 })
    const earned = badges.filter((b) => b.earned).map((b) => b.id)
    expect(earned).toContain('first-steps')
    expect(earned).toContain('streak-7')
    expect(earned).toContain('green-machine')
  })

  it('locks badges with insufficient stats', () => {
    const badges = evaluateBadges({})
    expect(badges.every((b) => !b.earned)).toBe(true)
  })
})
