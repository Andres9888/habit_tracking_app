/**
 * Basic Input Validators
 */

import { containsDangerousPatterns } from './security';
import type { ValidationResult } from './types';

/**
 * Validate habit name input
 */
export function validateHabitNameInput(
  value: string | undefined
): ValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, error: 'Habit name is required' };
  }

  const trimmed = value.trim();

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
): ValidationResult {
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
 * Validate emoji/icon input
 */
export function validateEmojiInput(
  value: string | undefined,
  fieldName: string = 'Icon'
): ValidationResult {
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
