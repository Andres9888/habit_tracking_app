import {
  MAX_HABIT_NAME_LENGTH,
  MIN_HABIT_NAME_LENGTH,
} from '@/constants';
import {
  createDateFromTimeString,
  getDefaultReminderTime,
} from '../../utils/notifications';
import { HABIT_NAME_REGEX } from './constants';

// Re-export from utils folder
export { extractTemplateDetails } from './utils/templateUtils';

/**
 * Characters allowed in habit names (alphanumeric, spaces, common punctuation, emojis)
 * Blocks control characters, null bytes, and potentially dangerous characters
 */
const ALLOWED_CHARS_REGEX = /^[\p{L}\p{N}\p{P}\p{S}\p{Z}\p{Emoji}]+$/u;

export interface ParsedHabitName {
  emoji: string | null;
  name: string;
}

export interface HabitNameValidationResult {
  isValid: boolean;
  error: string | null;
  sanitized: string;
}

/**
 * Validates and sanitizes habit name input
 * Returns validation result with sanitized string
 */
export const validateHabitName = (name: string): HabitNameValidationResult => {
  // Trim whitespace
  const trimmed = name.trim();

  // Check empty
  if (!trimmed || trimmed.length < MIN_HABIT_NAME_LENGTH) {
    return { error: 'Habit name is required', isValid: false, sanitized: '' };
  }

  // Check max length
  if (trimmed.length > MAX_HABIT_NAME_LENGTH) {
    return {
      error: `Habit name must be ${MAX_HABIT_NAME_LENGTH} characters or less`,
      isValid: false,
      sanitized: trimmed.slice(0, MAX_HABIT_NAME_LENGTH),
    };
  }

  // Remove null bytes and control characters (Unicode control category)
  const sanitized = trimmed.replaceAll('\0', '').replaceAll(/\p{Cc}/gu, '');

  // Check for valid characters
  if (!ALLOWED_CHARS_REGEX.test(sanitized)) {
    return {
      error: 'Habit name contains invalid characters',
      isValid: false,
      sanitized,
    };
  }

  return { error: null, isValid: true, sanitized };
};

export const parseHabitName = (fullName: string): ParsedHabitName => {
  if (!fullName || !fullName.trim()) {
    return { emoji: null, name: '' };
  }

  const match = fullName.match(HABIT_NAME_REGEX);
  if (match) {
    return { emoji: match[1], name: match[2] };
  }

  return { emoji: null, name: fullName.trim() };
};

export const parseReminderTime = (timeString?: string): Date => {
  return createDateFromTimeString(timeString, getDefaultReminderTime());
};

export const buildHabitName = (emoji: string | null, name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return '';
  return emoji ? `${emoji} ${trimmed}` : trimmed;
};
