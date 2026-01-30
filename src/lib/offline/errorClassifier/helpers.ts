/**
 * Error Classification Helpers
 */

import { classifyError } from './classify';

/**
 * Check if an error is a network connectivity error
 */
export function isNetworkError(error: unknown): boolean {
  return classifyError(error).category === 'network';
}

/**
 * Check if an error should trigger a retry
 */
export function shouldRetry(error: unknown): boolean {
  return classifyError(error).isRetryable;
}

/**
 * Get human-readable error message for UI display
 */
export function getDisplayMessage(error: unknown): string {
  const classified = classifyError(error);

  switch (classified.category) {
    case 'network': {
      return 'No internet connection. Changes will sync when online.';
    }
    case 'timeout': {
      return 'Request timed out. Will retry shortly.';
    }
    case 'server': {
      return 'Server is temporarily unavailable. Will retry shortly.';
    }
    case 'rateLimit': {
      return 'Too many requests. Will retry in a moment.';
    }
    case 'auth': {
      return 'Please sign in again to sync your changes.';
    }
    case 'validation': {
      return 'Some data could not be saved. Please check and try again.';
    }
    case 'notFound': {
      return 'The item you are trying to update no longer exists.';
    }
    case 'conflict': {
      return 'This item was modified elsewhere. Please refresh.';
    }
    default: {
      return 'Something went wrong. Will retry automatically.';
    }
  }
}
