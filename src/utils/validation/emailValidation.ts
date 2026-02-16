/**
 * Email Validation
 */

import type { ValidationResult } from './types';
import { containsDangerousPatterns } from './security';
import { MAX_EMAIL_LENGTH } from '@/constants';

/**
 * Validate email address format
 * - RFC 5322 compliant with practical restrictions
 * - Max length enforced
 * - No dangerous patterns
 */
export function validateEmail(email: string | undefined): ValidationResult {
  if (email === undefined || email === '') {
    return { error: 'Email is required', isValid: false };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > MAX_EMAIL_LENGTH) {
    return {
      error: `Email cannot exceed ${MAX_EMAIL_LENGTH} characters`,
      isValid: false,
    };
  }

  if (containsDangerousPatterns(trimmed)) {
    return { error: 'Email contains invalid characters', isValid: false };
  }

  // RFC 5322 simplified email regex (practical subset)
  const emailRegex =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

  if (!emailRegex.test(trimmed)) {
    return { error: 'Please enter a valid email address', isValid: false };
  }

  return { isValid: true, sanitized: trimmed };
}
