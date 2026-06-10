import { describe, expect, it } from 'vitest'
import { calculateFootprint } from '../utils/carbon'
import { generateRecommendations } from '../utils/recommendations'

describe('generateRecommendations', () => {
  it('suggests cutting car travel for heavy drivers', () => {
    const inputs = { transport: { car: 800 }, energy: {}, diet: 'vegan', waste: {} }
    const fp = calculateFootprint(inputs)
    const recs = generateRecommendations(fp, inputs)
    expect(recs.some((r) => r.id === 'car-reduce')).toBe(true)
  })

  it('suggests LED bulbs for high electricity use', () => {
    const inputs = { transport: {}, energy: { electricity: 400 }, diet: 'vegan', waste: {} }
    const recs = generateRecommendations(calculateFootprint(inputs), inputs)
    expect(recs.some((r) => r.id === 'led-bulbs')).toBe(true)
  })

  it('ranks recommendations by descending savings and tags impact', () => {
    const inputs = {
      transport: { car: 900, flight: 1000 },
      energy: { electricity: 500 },
      diet: 'nonveg',
      waste: { plastic: 5, recyclingRate: 10 },
    }
    const recs = generateRecommendations(calculateFootprint(inputs), inputs)
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i - 1].savingKg).toBeGreaterThanOrEqual(recs[i].savingKg)
    }
    expect(['low', 'medium', 'high']).toContain(recs[0].impact)
  })

  it('returns an encouraging default when footprint is minimal', () => {
    const inputs = { transport: {}, energy: {}, diet: 'vegan', waste: {} }
    const recs = generateRecommendations(calculateFootprint(inputs), inputs)
    expect(recs).toHaveLength(1)
    expect(recs[0].id).toBe('maintain')
  })
})
