/**
 * Form Input Security Utility (SEC-003: Frontend Input Sanitization)
 *
 * Re-exports all validation utilities from modular files.
 * Provides client-side input validation and sanitization for forms.
 * Works alongside Convex backend validation.
 *
 * SECURITY NOTES:
 * - Client-side validation is for UX only, never trust client validation alone
 * - Backend validation in convex/lib/inputValidation.ts is authoritative
 * - Sanitize to prevent XSS in the UI
 * - Never allow script tags, event handlers, or dangerous protocols
 */

// Types
export type {
  FormFieldError,
  FormValidationResult,
  ValidationResult,
  FieldValidator,
} from './validation/types';

// Security utilities
export {
  containsDangerousPatterns,
  sanitizeInput,
  getDisplayValue,
} from './validation/security';

// Basic validators
export {
  validateHabitNameInput,
  validateTextInput,
  validateEmojiInput,
} from './validation/basicValidators';

// Format validators
export {
  validateTimeInput,
  validateColorInput,
  validateUrlInput,
  validatePasswordStrength,
} from './validation/formatValidators';

// Form validation utilities
export { validateFormFields } from './validation/formValidation';
