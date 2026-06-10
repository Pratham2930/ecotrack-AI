import { describe, expect, it } from 'vitest'
import {
  isValidEmail,
  sanitizeNumber,
  sanitizeText,
  validatePassword,
} from '../utils/validation'

describe('isValidEmail', () => {
  it('accepts well-formed addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('  user@example.com  ')).toBe(true)
  })

  it('rejects malformed addresses and non-strings', () => {
    expect(isValidEmail('user@@example')).toBe(false)
    expect(isValidEmail('no-at.com')).toBe(false)
    expect(isValidEmail(null)).toBe(false)
  })
})

describe('validatePassword', () => {
  it('requires 8+ chars with a letter and a number', () => {
    expect(validatePassword('abc12345').valid).toBe(true)
  })

  it('rejects short or weak passwords', () => {
    expect(validatePassword('short1').valid).toBe(false)
    expect(validatePassword('allletters').valid).toBe(false)
    expect(validatePassword('12345678').valid).toBe(false)
  })
})

describe('sanitizeText', () => {
  it('strips angle brackets and control characters', () => {
    expect(sanitizeText('<script>alert(1)</script>')).toBe('scriptalert(1)/script')
    expect(sanitizeText('hi\u0000there')).toBe('hithere')
  })

  it('trims and clamps length', () => {
    expect(sanitizeText('   spaced   ')).toBe('spaced')
    expect(sanitizeText('a'.repeat(500), 10)).toHaveLength(10)
  })

  it('handles null/undefined', () => {
    expect(sanitizeText(null)).toBe('')
  })
})

describe('sanitizeNumber', () => {
  it('coerces and clamps to range', () => {
    expect(sanitizeNumber('42')).toBe(42)
    expect(sanitizeNumber(-5)).toBe(0)
    expect(sanitizeNumber(5, { min: 0, max: 3 })).toBe(3)
    expect(sanitizeNumber('not-a-number')).toBe(0)
  })
})
