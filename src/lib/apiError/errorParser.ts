/**
 * Error Parsing Utilities
 */

import type { ApiError } from './types';

/**
 * Parse a Convex or generic API error into a standardized format
 */
export function parseApiError(error: unknown): ApiError {
  // Convex ConvexError
  if (error instanceof Error && error.name === 'ConvexError') {
    const message = error.message || '';

    // User/validation errors - safe to show to user
    if (
      message.includes('Unauthenticated') ||
      message.includes('Not authorized') ||
      message.includes('Invalid') ||
      message.includes('required') ||
      message.includes('cannot be empty') ||
      message.includes('format') ||
      message.includes('exceed')
    ) {
      return {
        code: 'VALIDATION_ERROR',
        message: extractUserMessage(message),
        isUserError: true,
        originalError: error,
      };
    }

    // System errors - show generic message, log details
    return {
      code: 'API_ERROR',
      message:
        'An error occurred while processing your request. Please try again.',
      isUserError: false,
      originalError: error,
    };
  }

  // Standard JavaScript errors
  if (error instanceof Error) {
    // Network errors
    if (
      error.message.includes('Network') ||
      error.message.includes('ECONNREFUSED')
    ) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect. Please check your internet connection.',
        isUserError: true,
        originalError: error,
      };
    }

    // Timeout errors
    if (
      error.message.includes('timeout') ||
      error.message.includes('Timeout')
    ) {
      return {
        code: 'TIMEOUT_ERROR',
        message: 'Request timed out. Please try again.',
        isUserError: true,
        originalError: error,
      };
    }

    // Generic error
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
      isUserError: false,
      originalError: error,
    };
  }

  // Unknown error type
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred. Please try again later.',
    isUserError: false,
  };
}

/**
 * Extract a safe, user-friendly message from an error
 */
function extractUserMessage(errorMessage: string): string {
  // Known user-friendly patterns
  const patterns = [
    { regex: /Unauthenticated/i, message: 'You must be logged in' },
    {
      regex: /Not authorized/i,
      message: 'You do not have permission to do this',
    },
    { regex: /Habit name is required/i, message: 'Please enter a habit name' },
    { regex: /cannot be empty/i, message: 'This field cannot be empty' },
    {
      regex: /must be in .* format/i,
      message: 'Please check the format of this field',
    },
    {
      regex: /cannot exceed (\d+) characters/i,
      message: 'This field is too long',
    },
    { regex: /Invalid date format/i, message: 'Please enter a valid date' },
    {
      regex: /Future dates are not allowed/i,
      message: 'You cannot track future dates',
    },
  ];

  for (const { regex, message } of patterns) {
    if (regex.test(errorMessage)) {
      return message;
    }
  }

  // Fallback - return original if it looks safe
  return errorMessage.replace(/^Error:\s*/, '').slice(0, 200);
}
