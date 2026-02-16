const MAX_HABIT_NAME_LENGTH = 200;
const MIN_HABIT_NAME_LENGTH = 1;
const MAX_HABITS_RENDER_LIMIT = 500;

export function validateHabitName(name: string): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  if (name == null)
    return { error: 'Habit name is required', isValid: false, sanitized: '' };
  const trimmed = String(name).trim();
  if (trimmed.length < MIN_HABIT_NAME_LENGTH) {
    return {
      error: 'Habit name cannot be empty',
      isValid: false,
      sanitized: trimmed,
    };
  }
  if (trimmed.length > MAX_HABIT_NAME_LENGTH) {
    return {
      error: `Habit name must be ${MAX_HABIT_NAME_LENGTH} characters or less`,
      isValid: false,
      sanitized: trimmed.slice(0, MAX_HABIT_NAME_LENGTH),
    };
  }
  return { isValid: true, sanitized: trimmed };
}

export function validateDateString(dateString: string): {
  isValid: boolean;
  error?: string;
} {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return {
      error: 'Invalid date format. Expected YYYY-MM-DD',
      isValid: false,
    };
  }
  const [year, month, day] = dateString.split('-').map(Number);
  if (
    year < 1900 ||
    year > 2100 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return { error: 'Date components out of valid range', isValid: false };
  }
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
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 5);
  if (date < minDate) {
    return { error: 'Date is more than 5 years in the past', isValid: false };
  }
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  if (date > maxDate) {
    return { error: 'Date is more than 2 years in the future', isValid: false };
  }
  return { isValid: true };
}

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

  return parsed;
}
