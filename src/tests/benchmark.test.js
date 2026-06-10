import { describe, expect, it } from 'vitest'
import {
  benchmarkInsights,
  compareToAverage,
  comparisonChartData,
  globalPercentile,
} from '../utils/benchmark'

describe('compareToAverage', () => {
  it('flags the user as lower when below the average', () => {
    const r = compareToAverage(80, 100)
    expect(r.lower).toBe(true)
    expect(r.pct).toBe(20)
  })

  it('flags the user as higher when above the average', () => {
    expect(compareToAverage(150, 100).lower).toBe(false)
  })
})

describe('globalPercentile', () => {
  it('returns a top percentile between 1 and 100', () => {
    const { topPercent } = globalPercentile(100)
    expect(topPercent).toBeGreaterThanOrEqual(1)
    expect(topPercent).toBeLessThanOrEqual(100)
  })
})

describe('benchmarkInsights', () => {
  it('includes country, global and ranking insights', () => {
    const insights = benchmarkInsights(100, { country: 'IN', city: 'Mumbai' })
    expect(insights.length).toBeGreaterThanOrEqual(3)
    expect(insights.some((i) => i.includes('India'))).toBe(true)
    expect(insights.some((i) => i.toLowerCase().includes('top'))).toBe(true)
  })
})

describe('comparisonChartData', () => {
  it('always highlights the user and includes the global average', () => {
    const rows = comparisonChartData(120, { country: 'US', city: 'New York' })
    expect(rows[0]).toMatchObject({ name: 'You', highlight: true })
    expect(rows.some((r) => r.name === 'Global avg')).toBe(true)
  })
})
