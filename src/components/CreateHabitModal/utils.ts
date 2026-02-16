/**
 * Utility functions for CreateHabitModal
 *
 * @module CreateHabitModal/utils
 *
 * Provides validation, parsing, and formatting utilities for habit creation:
 * - Habit name validation and sanitization
 * - Emoji extraction from habit names
 * - Reminder time parsing
 * - Habit name construction
 */

import {
  createDateFromTimeString,
  getDefaultReminderTime,
} from '../../utils/notifications';
import { HABIT_NAME_REGEX } from './constants';

// Re-export from utils folder for convenience
export { extractTemplateDetails } from './utils/templateUtils';

/**
 * Maximum allowed length for habit names
 * Prevents excessively long names that don't display well
 */
export const HABIT_NAME_MAX_LENGTH = 100;

/**
 * Minimum required length for habit names
 * Ensures user provides a meaningful name
 */
export const HABIT_NAME_MIN_LENGTH = 1;

/**
 * Regular expression for allowed characters in habit names
 *
 * @description
 * Permits Unicode categories that are safe and meaningful:
 * - \p{L} - Letters (any language)
 * - \p{N} - Numbers
 * - \p{P} - Punctuation (periods, commas, etc.)
 * - \p{S} - Symbols (math, currency, etc.)
 * - \p{Z} - Separators (spaces)
 * - \p{Emoji} - Emoji characters
 *
 * Blocks control characters, null bytes, and potentially dangerous characters
 * for security and display consistency.
 */
const ALLOWED_CHARS_REGEX = /^[\p{L}\p{N}\p{P}\p{S}\p{Z}\p{Emoji}]+$/u;

/**
 * Result of parsing a habit name into emoji and text components
 */
export interface ParsedHabitName {
  /** Extracted emoji prefix (null if no emoji) */
  emoji: string | null;
  /** Habit name without emoji prefix */
  name: string;
}

/**
 * Result of habit name validation
 */
export interface HabitNameValidationResult {
  /** Whether the name passes all validation rules */
  isValid: boolean;
  /** Error message if validation failed (null if valid) */
  error: string | null;
  /** Sanitized version of the input (trimmed, control chars removed) */
  sanitized: string;
}

/**
 * Validates and sanitizes habit name input
 *
 * @param name - Raw habit name input from user
 * @returns Validation result with sanitized string and error message if invalid
 *
 * @example
 * validateHabitName("  Morning run  ") // → { isValid: true, error: null, sanitized: "Morning run" }
 * validateHabitName("") // → { isValid: false, error: "Habit name is required", sanitized: "" }
 * validateHabitName("x".repeat(200)) // → { isValid: false, error: "must be 100 characters or less", ... }
 *
 * @security
 * - Removes null bytes and control characters for safety
 * - Validates character set to prevent injection attacks
 * - Enforces length limits to prevent performance issues
 */
export const validateHabitName = (name: string): HabitNameValidationResult => {
  // Trim whitespace
  const trimmed = name.trim();

  // Check empty
  if (!trimmed || trimmed.length < HABIT_NAME_MIN_LENGTH) {
    return { error: 'Habit name is required', isValid: false, sanitized: '' };
  }

  // Check max length
  if (trimmed.length > HABIT_NAME_MAX_LENGTH) {
    return {
      error: `Habit name must be ${HABIT_NAME_MAX_LENGTH} characters or less`,
      isValid: false,
      sanitized: trimmed.slice(0, HABIT_NAME_MAX_LENGTH),
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

/**
 * Parses a full habit name into emoji and text components
 *
 * @param fullName - Full habit name (may include emoji prefix)
 * @returns Object with separated emoji and name
 *
 * @example
 * parseHabitName("💪 Morning workout") // → { emoji: "💪", name: "Morning workout" }
 * parseHabitName("Read daily") // → { emoji: null, name: "Read daily" }
 * parseHabitName("") // → { emoji: null, name: "" }
 *
 * @see {@link HABIT_NAME_REGEX} - Pattern used for extraction
 */
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

/**
 * Parses a reminder time string into a Date object
 *
 * @param timeString - Time string in HH:mm format (optional)
 * @returns Date object set to the specified time today, or default if invalid
 *
 * @example
 * parseReminderTime("09:00") // → Date for 9:00 AM today
 * parseReminderTime(undefined) // → Date for default reminder time
 *
 * @see {@link createDateFromTimeString} - Underlying time parser
 * @see {@link getDefaultReminderTime} - Default fallback time
 */
export const parseReminderTime = (timeString?: string): Date => {
  return createDateFromTimeString(timeString, getDefaultReminderTime());
};

/**
 * Builds a full habit name from emoji and text components
 *
 * @param emoji - Emoji icon (null for no emoji)
 * @param name - Habit name text
 * @returns Full habit name with emoji prefix (if provided)
 *
 * @example
 * buildHabitName("💪", "Morning workout") // → "💪 Morning workout"
 * buildHabitName(null, "Morning workout") // → "Morning workout"
 * buildHabitName("💪", "  ") // → "" (empty after trim)
 */
export const buildHabitName = (emoji: string | null, name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return '';
  return emoji ? `${emoji} ${trimmed}` : trimmed;
};
