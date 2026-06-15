/**
 * Form validation + input sanitization helpers.
 * Used both by React Hook Form rules and by unit tests.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email) {
  if (typeof email !== 'string') return false
  return EMAIL_RE.test(email.trim())
}

/**
 * Password policy: min 8 chars, at least one letter and one number.
 */
export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters.' }
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return { valid: false, message: 'Password must contain a letter and a number.' }
  }
  return { valid: true, message: '' }
}

/**
 * Sanitize free-text input: strip angle brackets and control chars, trim,
 * and clamp length to prevent injection / overflow.
 */
export function sanitizeText(value, maxLength = 280) {
  if (value == null) return ''
  return String(value)
    .replace(/[<>]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength)
}

/**
 * Coerce + validate a numeric input. Returns a non-negative finite number.
 */
export function sanitizeNumber(value, { min = 0, max = 1_000_000 } = {}) {
  const n = typeof value === 'string' ? parseFloat(value) : value
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, n))
}

/** React Hook Form validation rule objects. */
export const rules = {
  email: {
    required: 'Email is required',
    validate: (v) => isValidEmail(v) || 'Enter a valid email address',
  },
  password: {
    required: 'Password is required',
    validate: (v) => validatePassword(v).valid || validatePassword(v).message,
  },
  displayName: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name is too short' },
    maxLength: { value: 60, message: 'Name is too long' },
  },
  nonNegative: {
    min: { value: 0, message: 'Value cannot be negative' },
    valueAsNumber: true,
  },
}
