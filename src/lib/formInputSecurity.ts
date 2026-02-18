/**
 * Form Input Security Utility (SEC-003: Frontend Input Sanitization)
 *
 * Provides client-side input validation and sanitization for forms.
 * Works alongside Convex backend validation.
 *
 * SECURITY NOTES:
 * - Client-side validation is for UX only, never trust client validation alone
 * - Backend validation in convex/lib/inputValidation.ts is authoritative
 * - Sanitize to prevent XSS in the UI
 * - Never allow script tags, event handlers, or dangerous protocols
 */

export interface FormFieldError {
  field: string;
  message: string;
  code: 'required' | 'invalid_format' | 'too_long' | 'dangerous_content';
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}

/**
 * Patterns that indicate XSS or injection attempts
 */
const DANGEROUS_PATTERNS = [
  /<script\b/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<iframe\b/i,
  /<embed\b/i,
  /<object\b/i,
];

/**
 * Check if input contains dangerous patterns
 */
export function containsDangerousPatterns(input: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Sanitize string for safe display (prevent XSS)
 */
export function sanitizeInput(input: string | undefined): string {
  if (!input) return '';

  return (
    input
      // Remove potentially dangerous characters while preserving normal text
      .replace(/<script\b[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      // Trim whitespace
      .trim()
  );
}

/**
 * Validate habit name input
 */
export function validateHabitNameInput(
  value: string | undefined
): { isValid: boolean; error?: string } {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'Habit name is required' };
  }

  const trimmed = value.trim();

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Habit name must be at least 2 characters' };
  }

  if (trimmed.length > 100) {
    return { isValid: false, error: 'Habit name cannot exceed 100 characters' };
  }

  if (containsDangerousPatterns(trimmed)) {
    return { isValid: false, error: 'Habit name contains invalid characters' };
  }

  return { isValid: true };
}

/**
 * Validate text input (notes, reflections)
 */
export function validateTextInput(
  value: string | undefined,
  maxLength: number = 5000,
  minLength: number = 0,
  fieldName: string = 'Text'
): { isValid: boolean; error?: string } {
  if (!value) {
    if (minLength > 0) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
  }

  const trimmed = value.trim();

  if (minLength > 0 && trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${maxLength} characters`,
    };
  }

  if (containsDangerousPatterns(trimmed)) {
    return { isValid: false, error: `${fieldName} contains invalid content` };
  }

  return { isValid: true };
}

/**
 * Validate time input (HH:MM format)
 */
export function validateTimeInput(
  value: string | undefined,
  fieldName: string = 'Time'
): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: true };
  }

  const trimmed = value.trim();
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(trimmed)) {
    return { isValid: false, error: `${fieldName} must be in HH:MM format (e.g., 09:30)` };
  }

  return { isValid: true };
}

/**
 * Validate color input
 */
export function validateColorInput(
  value: string | undefined,
  fieldName: string = 'Color'
): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: true };
  }

  const trimmed = value.trim().toLowerCase();

  // Hex color (#RGB or #RRGGBB)
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) {
    return { isValid: true };
  }

  // Named colors
  const validColors = [
    'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink',
    'brown', 'black', 'white', 'gray', 'cyan', 'magenta',
  ];
  if (validColors.includes(trimmed)) {
    return { isValid: true };
  }

  return { isValid: false, error: `${fieldName} must be a valid hex color or color name` };
}

/**
 * Validate emoji/icon input
 */
export function validateEmojiInput(
  value: string | undefined,
  fieldName: string = 'Icon'
): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: true };
  }

  const trimmed = value.trim();

  if (trimmed.length > 20) {
    return { isValid: false, error: `${fieldName} is too long` };
  }

  if (containsDangerousPatterns(trimmed)) {
    return { isValid: false, error: `${fieldName} contains invalid content` };
  }

  return { isValid: true };
}

/**
 * Validate URL input (for vision board images, etc.)
 */
export function validateUrlInput(
  value: string | undefined,
  fieldName: string = 'URL'
): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: true };
  }

  const trimmed = value.trim();

  if (trimmed.length > 2048) {
    return { isValid: false, error: `${fieldName} is too long` };
  }

  try {
    const url = new URL(trimmed);

    // Require HTTPS
    if (url.protocol !== 'https:') {
      return { isValid: false, error: `${fieldName} must use HTTPS` };
    }

    // Block dangerous protocols
    if (['javascript:', 'data:', 'vbscript:'].includes(url.protocol)) {
      return { isValid: false, error: `${fieldName} contains invalid protocol` };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: `${fieldName} is not a valid URL` };
  }
}

/**
 * Validate all form fields at once
 */
export function validateFormFields(fields: {
  [key: string]: { value: string | undefined; validator: (v: string | undefined) => { isValid: boolean; error?: string } };
}): FormValidationResult {
  const errors: FormFieldError[] = [];

  for (const [fieldName, { value, validator }] of Object.entries(fields)) {
    const result = validator(value);
    if (!result.isValid) {
      errors.push({
        field: fieldName,
        message: result.error || 'Invalid input',
        code: 'invalid_format',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get display value for form field (sanitized)
 */
export function getDisplayValue(value: string | undefined): string {
  if (!value) return '';
  return sanitizeInput(value);
}

/**
 * Check if a password meets security requirements
 */
export function validatePasswordStrength(password: string | undefined): {
  isValid: boolean;
  errors: string[];
} {
  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }

  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
