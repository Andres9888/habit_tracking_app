/**
 * Constants for InlineEmojiInput component
 */

import type { ValidationMessage } from './types';

export const MAX_LENGTH = 50;

/**
 * Get validation message based on habit name input
 */
export const getValidationMessage = (
  name: string
): ValidationMessage | null => {
  const trimmed = name.trim();
  if (!trimmed) return null;

  if (trimmed.length >= 10 && /\d/.test(trimmed)) {
    return { message: '✓ Great habit! Specific & achievable', type: 'success' };
  }

  if (trimmed.length >= 5) {
    return {
      message: 'Add a number for specificity (e.g., "10 min")',
      type: 'tip',
    };
  }

  return null;
};

/**
 * Get color class for validation message type
 */
export const getValidationColor = (
  type: 'success' | 'tip' | 'warning' | undefined
): string => {
  switch (type) {
    case 'success': {
      return 'text-emerald-600';
    }
    case 'warning': {
      return 'text-amber-600';
    }
    default: {
      return 'text-stone-500';
    }
  }
};
