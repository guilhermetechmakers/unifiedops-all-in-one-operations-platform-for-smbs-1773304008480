/**
 * Client-side password strength and validation helpers.
 * Server enforces policy; this is for UX only.
 */

const MIN_LENGTH = 8
const HAS_LOWER = /[a-z]/
const HAS_UPPER = /[A-Z]/
const HAS_NUMBER = /\d/
const HAS_SPECIAL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/

export interface PasswordStrength {
  score: number
  label: 'Weak' | 'Fair' | 'Good' | 'Strong'
  passed: boolean
  checks: { label: string; ok: boolean }[]
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= MIN_LENGTH },
    { label: 'One lowercase letter', ok: HAS_LOWER.test(password) },
    { label: 'One uppercase letter', ok: HAS_UPPER.test(password) },
    { label: 'One number', ok: HAS_NUMBER.test(password) },
    { label: 'One special character', ok: HAS_SPECIAL.test(password) },
  ]
  const passed = checks.every((c) => c.ok)
  const score = checks.filter((c) => c.ok).length
  const label: PasswordStrength['label'] =
    score <= 2 ? 'Weak' : score <= 3 ? 'Fair' : score <= 4 ? 'Good' : 'Strong'
  return { score, label, passed, checks }
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < MIN_LENGTH) {
    return { valid: false, message: 'Password must be at least 8 characters' }
  }
  const strength = checkPasswordStrength(password)
  if (!strength.passed) {
    const missing = strength.checks.filter((c) => !c.ok).map((c) => c.label)
    return { valid: false, message: missing[0] ?? 'Password does not meet requirements' }
  }
  return { valid: true }
}
