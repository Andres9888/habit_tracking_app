/**
 * Text Field Validation
 */

import type { ValidationResult } from './types';
import { containsDangerousPatterns } from './security';
import {
  MAX_HABIT_NAME_LENGTH,
  MAX_LONG_TEXT_LENGTH,
  MAX_SHORT_TEXT_LENGTH,
} from '@/constants';

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
