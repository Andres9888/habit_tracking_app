/**
 * Format-specific Input Validators
 */

import type { ValidationResult } from './types';

/**
 * Validate time input (HH:MM format)
 */
export function validateTimeInput(
  value: string | undefined,
  fieldName: string = 'Time'
): ValidationResult {
  if (!value) {
    return { isValid: true };
  }

  const trimmed = value.trim();
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldName} must be in HH:MM format (e.g., 09:30)`,
    };
  }

  return { isValid: true };
}

/**
 * Validate color input
 */
export function validateColorInput(
  value: string | undefined,
  fieldName: string = 'Color'
): ValidationResult {
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
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'brown',
    'black',
    'white',
    'gray',
    'cyan',
    'magenta',
  ];
  if (validColors.includes(trimmed)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `${fieldName} must be a valid hex color or color name`,
  };
}

/**
 * Validate URL input (for vision board images, etc.)
 */
export function validateUrlInput(
  value: string | undefined,
  fieldName: string = 'URL'
): ValidationResult {
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
      return {
        isValid: false,
        error: `${fieldName} contains invalid protocol`,
      };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: `${fieldName} is not a valid URL` };
  }
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

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
