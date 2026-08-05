/**
 * Client-Side Input Validation
 *
 * Mirrors the backend validation in convex/lib/inputValidation.ts
 * Provides real-time validation feedback to users before submitting forms.
 */

// Re-export types
export type { ValidationResult } from './types';

// Re-export validation functions
export { validateEmail } from './emailValidation';
export { validatePassword } from './passwordValidation';
export {
  validateHabitName,
  validateLongText,
  validateShortText,
} from './textValidation';

// Re-export constants from central constants file
export {
  MAX_EMAIL_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_HABIT_NAME_LENGTH,
  MAX_LONG_TEXT_LENGTH,
  MAX_SHORT_TEXT_LENGTH,
} from '@/constants';

// Re-export security utilities
export { containsDangerousPatterns } from './security';

// Helper functions
export function getValidationMessage(result: {
  error?: string;
}): string | undefined {
  return result.error;
}

export function isValid(result: { isValid: boolean }): boolean {
  return result.isValid;
}
