import { describe, expect, it } from 'vitest'
import {
  calcEnergy,
  calcFood,
  calcTransport,
  calcWaste,
  calculateFootprint,
  formatKg,
  offsetEquivalents,
  scoreRating,
  sustainabilityScore,
} from '../utils/carbon'

describe('calcTransport', () => {
  it('sums distance * emission factor per mode', () => {
    expect(calcTransport({ car: 100 })).toBeCloseTo(19.2, 5)
    expect(calcTransport({ train: 100 })).toBeCloseTo(4.1, 5)
  })

  it('treats missing/negative values as zero', () => {
    expect(calcTransport({})).toBe(0)
    expect(calcTransport({ car: -50 })).toBe(0)
    expect(calcTransport({ car: 'abc' })).toBe(0)
  })

  it('parses numeric strings', () => {
    expect(calcTransport({ car: '100' })).toBeCloseTo(19.2, 5)
  })
})

describe('calcEnergy', () => {
  it('combines electricity and LPG', () => {
    expect(calcEnergy({ electricity: 100, lpg: 10 })).toBeCloseTo(100 * 0.475 + 10 * 2.983, 5)
  })
})

describe('calcFood', () => {
  it('returns diet factor and 0 for unknown diets', () => {
    expect(calcFood('vegan')).toBe(45)
    expect(calcFood('nonveg')).toBe(99)
    expect(calcFood('unknown')).toBe(0)
  })
})

describe('calcWaste', () => {
  it('applies recycling reduction (up to 50% at 100%)', () => {
    const gross = calcWaste({ plastic: 10, paper: 10, recyclingRate: 0 })
    const full = calcWaste({ plastic: 10, paper: 10, recyclingRate: 100 })
    expect(full).toBeCloseTo(gross * 0.5, 5)
  })

  it('clamps recycling rate to 0-100', () => {
    const a = calcWaste({ plastic: 5, recyclingRate: 200 })
    const b = calcWaste({ plastic: 5, recyclingRate: 100 })
    expect(a).toBe(b)
  })
})

describe('calculateFootprint', () => {
  it('returns per-category breakdown summing to total', () => {
    const r = calculateFootprint({
      transport: { car: 100 },
      energy: { electricity: 100 },
      diet: 'vegetarian',
      waste: { plastic: 1, recyclingRate: 0 },
    })
    expect(r.total).toBeCloseTo(r.transport + r.energy + r.food + r.waste, 5)
    expect(r.breakdown).toHaveLength(4)
  })
})

describe('sustainabilityScore', () => {
  it('clamps to 0-100 against reference range', () => {
    expect(sustainabilityScore(50)).toBe(100)
    expect(sustainabilityScore(5000)).toBe(0)
    expect(sustainabilityScore(1050)).toBe(50)
  })
})

describe('scoreRating', () => {
  it('maps scores to qualitative labels', () => {
    expect(scoreRating(90).label).toBe('Excellent')
    expect(scoreRating(10).label).toBe('Critical')
  })
})

describe('offsetEquivalents', () => {
  it('computes trees and equivalences from annual emissions', () => {
    const o = offsetEquivalents(100)
    expect(o.annualKg).toBe(1200)
    expect(o.treesNeeded).toBe(Math.ceil(1200 / 21))
    expect(o.carKm).toBeGreaterThan(0)
  })
})

describe('formatKg', () => {
  it('formats kilograms and tonnes', () => {
    expect(formatKg(500)).toBe('500 kg')
    expect(formatKg(1500)).toBe('1.5 t')
  })
})
