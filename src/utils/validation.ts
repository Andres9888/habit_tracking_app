/* eslint-disable max-lines */
/**
 * Input Validation Utilities
 *
 * Defensive guards for edge cases in user input.
 * Mirrors backend validation to provide real-time feedback.
 *
 * @module validation
 * @category Validation
 */

import {
  MAX_HABIT_NAME_LENGTH,
  MIN_HABIT_NAME_LENGTH,
  MAX_HABITS_RENDER_LIMIT,
} from '@/constants';

/**
 * Validate and sanitize habit name.
 * Guards against: null/undefined, empty strings, very long strings, whitespace-only.
 *
 * @param name - The habit name to validate
 * @returns Validation result with isValid, sanitized name, and optional error
 * @returns.isValid - Whether the name passes validation
 * @returns.sanitized - Sanitized name (trimmed, truncated if too long)
 * @returns.error - Error message if validation failed
 *
 * @example
 * validateHabitName('Morning Exercise')
 * // { isValid: true, sanitized: 'Morning Exercise' }
 *
 * @example
 * validateHabitName('   ')
 * // { isValid: false, sanitized: '', error: 'Habit name cannot be empty' }
 *
 * @example
 * validateHabitName('A'.repeat(300))
 * // { isValid: false, sanitized: 'AAAA...', error: 'Habit name must be 200 characters or less' }
 */
export function validateHabitName(name: string | undefined): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  // Guard against null/undefined
  if (name === null || name === undefined) {
    return {
      error: 'Habit name is required',
      isValid: false,
      sanitized: '',
    };
  }

  // Convert to string and trim
  const trimmed = String(name).trim();

  // Check minimum length
  if (trimmed.length < MIN_HABIT_NAME_LENGTH) {
    return {
      error: 'Habit name cannot be empty',
      isValid: false,
      sanitized: trimmed,
    };
  }

  // Check maximum length
  if (trimmed.length > MAX_HABIT_NAME_LENGTH) {
    return {
      error: `Habit name must be ${MAX_HABIT_NAME_LENGTH} characters or less`,
      isValid: false,
      sanitized: trimmed.slice(0, MAX_HABIT_NAME_LENGTH),
    };
  }

  return {
    isValid: true,
    sanitized: trimmed,
  };
}

/**
 * Validate date string format and range.
 * Guards against: invalid formats, future dates (beyond 2 years), very old dates (beyond 5 years).
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Validation result with isValid and optional error
 * @returns.isValid - Whether the date passes validation
 * @returns.error - Error message if validation failed
 *
 * @example
 * validateDateString('2024-01-15')
 * // { isValid: true }
 *
 * @example
 * validateDateString('2024-13-01')
 * // { isValid: false, error: 'Date components out of valid range' }
 *
 * @example
 * validateDateString('not-a-date')
 * // { isValid: false, error: 'Invalid date format. Expected YYYY-MM-DD' }
 */
export function validateDateString(dateString: string): {
  isValid: boolean;
  error?: string;
} {
  // Check format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return {
      error: 'Invalid date format. Expected YYYY-MM-DD',
      isValid: false,
    };
  }

  // Parse components
  const [year, month, day] = dateString.split('-').map(Number);

  // Validate ranges
  if (
    year < 1900 ||
    year > 2100 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return {
      error: 'Date components out of valid range',
      isValid: false,
    };
  }

  // Try to create date to validate it's real (e.g., not Feb 30)
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return {
      error: 'Invalid date (e.g., Feb 30 does not exist)',
      isValid: false,
    };
  }

  // Guard against dates too far in past (performance concern)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 5);
  if (date < minDate) {
    return {
      error: 'Date is more than 5 years in the past',
      isValid: false,
    };
  }

  // Guard against dates too far in future
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  if (date > maxDate) {
    return {
      error: 'Date is more than 2 years in the future',
      isValid: false,
    };
  }

  return { isValid: true };
}

/**
 * Validate habits array size for performance.
 * Guards against non-arrays and provides truncation warning for large arrays.
 *
 * @param habits - Array of habits to validate
 * @returns Validation result with isValid, limited array, and optional warning
 * @returns.isValid - Whether the array is valid (even if truncated)
 * @returns.limited - Original array or truncated copy if too large
 * @returns.warning - Warning message if array was truncated
 *
 * @example
 * validateHabitsArray([{id: '1'}, {id: '2'}])
 * // { isValid: true, limited: [{id: '1'}, {id: '2'}] }
 *
 * @example
 * validateHabitsArray(largeArrayOf500Plus)
 * // { isValid: true, limited: [...500 items], warning: 'Too many habits...' }
 */
export function validateHabitsArray<T>(habits: T[]): {
  isValid: boolean;
  limited: T[];
  warning?: string;
} {
  if (!Array.isArray(habits)) {
    return {
      isValid: false,
      limited: [],
      warning: 'Habits must be an array',
    };
  }

  if (habits.length > MAX_HABITS_RENDER_LIMIT) {
    return {
      isValid: true,
      limited: habits.slice(0, MAX_HABITS_RENDER_LIMIT),
      warning: `Too many habits (${habits.length}). Showing first ${MAX_HABITS_RENDER_LIMIT} for performance.`,
    };
  }

  return {
    isValid: true,
    limited: habits,
  };
}

/**
 * Safe number parsing with bounds checking.
 * Parses a value to a number with fallback and optional min/max constraints.
 *
 * @param value - Value to parse as number
 * @param defaultValue - Fallback value if parsing fails
 * @param min - Optional minimum bound
 * @param max - Optional maximum bound
 * @returns Parsed number within bounds, or defaultValue if parsing fails
 *
 * @example
 * safeParseNumber('42', 0) // 42
 * safeParseNumber('invalid', 0) // 0
 * safeParseNumber(100, 0, 0, 50) // 50 (capped at max)
 * safeParseNumber(-10, 0, 0, 50) // 0 (floored at min)
 */
export function safeParseNumber(
  value: unknown,
  defaultValue: number,
  min?: number,
  max?: number
): number {
  const parsed =
    typeof value === 'number' ? value : Number.parseFloat(String(value));

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return defaultValue;
  }

  if (min !== undefined && parsed < min) return min;
  if (max !== undefined && parsed > max) return max;

  return Object.is(parsed, -0) ? 0 : parsed;
}

/**
 * Validate email address format.
 *
 * @param email - Email address to validate
 * @returns Validation result with isValid and optional error message
 */
export function validateEmail(
  email: string | undefined
): {
  isValid: boolean;
  error?: string;
} {
  if (!email || email.trim().length === 0) {
    return {
      error: 'Email is required',
      isValid: false,
    };
  }

  // Basic email validation regex (RFC 5322 simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      error: 'Please enter a valid email address',
      isValid: false,
    };
  }

  return { isValid: true };
}

/**
 * Validate password strength.
 *
 * @param password - Password to validate
 * @returns Validation result with isValid and optional error message
 */
export function validatePassword(
  password: string | undefined
): {
  isValid: boolean;
  error?: string;
} {
  if (!password || password.length === 0) {
    return {
      error: 'Password is required',
      isValid: false,
    };
  }

  if (password.length < 8) {
    return {
      error: 'Password must be at least 8 characters',
      isValid: false,
    };
  }

  return { isValid: true };
}
