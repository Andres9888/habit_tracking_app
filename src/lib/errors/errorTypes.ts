/**
 * Error Type Definitions
 * Categorizes errors for better error UX and handling
 */

export type ErrorCategory =
  | 'network'
  | 'auth'
  | 'validation'
  | 'server'
  | 'permission'
  | 'unknown';

export interface CategorizedError {
  originalError: Error;
  category: ErrorCategory;
  userMessage: string;
  technicalMessage: string;
  isRetryable: boolean;
  suggestedAction: 'retry' | 'logout' | 'contact-support' | 'none';
}

/**
 * Categorizes an error and provides user-friendly messaging
 */
export function categorizeError(error: unknown): CategorizedError {
  const originalError =
    error instanceof Error ? error : new Error(String(error));
  const message = originalError.message.toLowerCase();
  const stack = originalError.stack?.toLowerCase() ?? '';

  // Network errors
  if (
    message.includes('network') ||
    message.includes('offline') ||
    message.includes('connection') ||
    message.includes('timeout') ||
    message.includes('fetch')
  ) {
    return {
      originalError,
      category: 'network',
      userMessage:
        'Check your internet connection and try again. Your data will sync once you're back online.',
      technicalMessage: `Network error: ${originalError.message}`,
      isRetryable: true,
      suggestedAction: 'retry',
    };
  }

  // Auth errors
  if (
    message.includes('auth') ||
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('clerk') ||
    stack.includes('clerk')
  ) {
    return {
      originalError,
      category: 'auth',
      userMessage:
        'Your session has expired. Sign out and sign back in to continue.',
      technicalMessage: `Auth error: ${originalError.message}`,
      isRetryable: false,
      suggestedAction: 'logout',
    };
  }

  // Validation errors
  if (
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required')
  ) {
    return {
      originalError,
      category: 'validation',
      userMessage: 'Please check your input and try again.',
      technicalMessage: `Validation error: ${originalError.message}`,
      isRetryable: true,
      suggestedAction: 'none',
    };
  }

  // Server errors (5xx)
  if (
    message.includes('500') ||
    message.includes('502') ||
    message.includes('503') ||
    message.includes('server') ||
    message.includes('internal')
  ) {
    return {
      originalError,
      category: 'server',
      userMessage:
        'Our servers are having trouble. We're working on it. Try again in a moment.',
      technicalMessage: `Server error: ${originalError.message}`,
      isRetryable: true,
      suggestedAction: 'retry',
    };
  }

  // Permission errors
  if (
    message.includes('permission') ||
    message.includes('denied') ||
    message.includes('access')
  ) {
    return {
      originalError,
      category: 'permission',
      userMessage: "You don't have permission to do this.",
      technicalMessage: `Permission error: ${originalError.message}`,
      isRetryable: false,
      suggestedAction: 'none',
    };
  }

  // Unknown errors
  return {
    originalError,
    category: 'unknown',
    userMessage:
      'Something unexpected happened, but your data is safe. Try again or contact support.',
    technicalMessage: `Unknown error: ${originalError.message}`,
    isRetryable: true,
    suggestedAction: 'contact-support',
  };
}
