/**
 * Text Field Validation
 */

import type { ValidationResult } from './types';
import { containsDangerousPatterns } from './security';

export const MAX_HABIT_NAME_LENGTH = 100;
export const MAX_LONG_TEXT_LENGTH = 5000;
export const MAX_SHORT_TEXT_LENGTH = 500;

/**
 * Validate and sanitize a habit name
 * Allows: alphanumeric, spaces, common punctuation, and emoji
 */
export function validateHabitName(name: string | undefined): ValidationResult {
  if (name === undefined || name === '') {
    return { error: 'Habit name is required', isValid: false };
  }

  const trimmed = name.trim();

  if (!trimmed) {
    return { error: 'Habit name cannot be empty', isValid: false };
  }

  if (trimmed.length > MAX_HABIT_NAME_LENGTH) {
    return {
      error: `Habit name cannot exceed ${MAX_HABIT_NAME_LENGTH} characters`,
      isValid: false,
    };
  }

  if (containsDangerousPatterns(trimmed)) {
    return { error: 'Habit name contains invalid characters', isValid: false };
  }

  // Minimum length check (at least 2 characters)
  if (trimmed.length < 2) {
    return {
      error: 'Habit name must be at least 2 characters',
      isValid: false,
    };
  }

  return { isValid: true, sanitized: trimmed };
}

/**
 * Validate long text content (notes, reflections)
 */
export function validateLongText(
  text: string | undefined,
  maxLength: number = MAX_LONG_TEXT_LENGTH,
  fieldName: string = 'Text'
): ValidationResult {
  if (text === undefined || text === '') {
    return { isValid: true };
  }

  const trimmed = text.trim();

  if (trimmed.length > maxLength) {
    return {
      error: `${fieldName} cannot exceed ${maxLength} characters`,
      isValid: false,
    };
  }

  if (containsDangerousPatterns(trimmed)) {
    return { error: `${fieldName} contains invalid content`, isValid: false };
  }

  return { isValid: true, sanitized: trimmed };
}

/**
 * Validate short text (labels, captions)
 */
export function validateShortText(
  text: string | undefined,
  maxLength: number = MAX_SHORT_TEXT_LENGTH,
  fieldName: string = 'Text'
): ValidationResult {
  return validateLongText(text, maxLength, fieldName);
}
