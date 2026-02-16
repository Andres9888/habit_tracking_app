/**
 * Password Validation
 */

import type { ValidationResult } from './types';
import { containsDangerousPatterns } from './security';
import { MIN_PASSWORD_LENGTH } from '@/constants';

/**
 * Validate password strength
 * - Minimum length enforced
 * - Common patterns checked
 * - No dangerous patterns
 */
export function validatePassword(
  password: string | undefined,
  options: {
    requireStrong?: boolean;
    fieldName?: string;
  } = {}
): ValidationResult {
  const { requireStrong = true, fieldName = 'Password' } = options;

  if (password === undefined || password === '') {
    return { error: `${fieldName} is required`, isValid: false };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `${fieldName} must be at least ${MIN_PASSWORD_LENGTH} characters`,
      isValid: false,
    };
  }

  if (containsDangerousPatterns(password)) {
    return {
      error: `${fieldName} contains invalid characters`,
      isValid: false,
    };
  }

  if (requireStrong) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthCount = [
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecial,
    ].filter(Boolean).length;

    if (strengthCount < 2) {
      return {
        error: `${fieldName} must include at least 2 of: uppercase, lowercase, number, special character`,
        isValid: false,
      };
    }
  }

  return { isValid: true, sanitized: password };
}
