/**
 * Input Validation Utilities
 * Defensive guards for edge cases
 */

const MAX_HABIT_NAME_LENGTH = 200;
const MIN_HABIT_NAME_LENGTH = 1;
const MAX_HABITS_RENDER_LIMIT = 500; // Performance guard

/**
 * Validate and sanitize habit name
 * Guards against: empty strings, very long strings, whitespace-only
 */
export function validateHabitName(name: string): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  // Guard against null/undefined
  if (name == null) {
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
 * Validate date string format and range
 * Guards against: invalid formats, future dates (beyond reasonable range), very old dates
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
 * Validate habits array size for performance
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
 * Safe number parsing with bounds
 */
export function safeParseNumber(
  value: unknown,
  defaultValue: number,
  min?: number,
  max?: number
): number {
  const parsed =
    typeof value === 'number' ? value : parseFloat(String(value));

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return defaultValue;
  }

  if (min !== undefined && parsed < min) return min;
  if (max !== undefined && parsed > max) return max;

  return parsed;
}
