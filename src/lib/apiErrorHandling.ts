/**
 * API Error Handling Utility (SEC-002: Error Handling & Information Disclosure Prevention)
 *
 * Provides standardized error handling for API calls with proper logging,
 * user-friendly messaging, and security considerations.
 *
 * SECURITY NOTES:
 * - Never expose internal error details to users
 * - Log full errors server-side, generic messages to client
 * - Distinguish between expected errors (validation) and unexpected (system)
 * - Prevent information disclosure through error messages
 */

export interface ApiError {
  code: string;
  message: string;
  statusCode?: number;
  originalError?: Error;
  isUserError: boolean; // true = validation/expected, false = system/server error
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Check if an error is a user/validation error based on message patterns
 */
function isUserValidationError(message: string): boolean {
  return (
    message.includes('Unauthenticated') ||
    message.includes('Not authorized') ||
    message.includes('Invalid') ||
    message.includes('required') ||
    message.includes('cannot be empty') ||
    message.includes('format') ||
    message.includes('exceed')
  );
}

/**
 * Parse a Convex ConvexError into a standardized format
 */
function parseConvexError(error: Error): ApiError {
  const message = error.message || '';

  // User/validation errors - safe to show to user
  if (isUserValidationError(message)) {
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
    message: 'An error occurred while processing your request. Please try again.',
    isUserError: false,
    originalError: error,
  };
}

/**
 * Parse a standard JavaScript Error into a standardized format
 */
function parseJavaScriptError(error: Error): ApiError {
  // Network errors
  if (error.message.includes('Network') || error.message.includes('ECONNREFUSED')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Unable to connect. Please check your internet connection.',
      isUserError: true,
      originalError: error,
    };
  }

  // Timeout errors
  if (error.message.includes('timeout') || error.message.includes('Timeout')) {
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

/**
 * Parse a Convex or generic API error into a standardized format
 */
export function parseApiError(error: unknown): ApiError {
  // Convex ConvexError
  if (error instanceof Error && error.name === 'ConvexError') {
    return parseConvexError(error);
  }

  // Standard JavaScript errors
  if (error instanceof Error) {
    return parseJavaScriptError(error);
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
    { regex: /Not authorized/i, message: 'You do not have permission to do this' },
    { regex: /Habit name is required/i, message: 'Please enter a habit name' },
    { regex: /cannot be empty/i, message: 'This field cannot be empty' },
    { regex: /must be in .* format/i, message: 'Please check the format of this field' },
    { regex: /cannot exceed (\d+) characters/i, message: 'This field is too long' },
    { regex: /Invalid date format/i, message: 'Please enter a valid date' },
    { regex: /Future dates are not allowed/i, message: 'You cannot track future dates' },
  ];

  for (const { regex, message } of patterns) {
    if (regex.test(errorMessage)) {
      return message;
    }
  }

  // Fallback - return original if it looks safe
  return errorMessage.replace(/^Error:\s*/, '').slice(0, 200);
}

/**
 * Log API error safely (server-side logs only)
 */
export function logApiError(error: ApiError, context: string): void {
  if (__DEV__) {
    console.error(`[${context}]`, {
      code: error.code,
      message: error.message,
      original: error.originalError?.message,
    });
  }

  // In production, you might send to error tracking service (Sentry, etc.)
  // Example: Sentry.captureException(error.originalError, { tags: { context } });
}

/**
 * Wrap an async API call with error handling
 */
export async function withApiErrorHandling<T>(
  fn: () => Promise<T>,
  context: string = 'API Call'
): Promise<ApiResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    const apiError = parseApiError(error);
    logApiError(apiError, context);
    return { success: false, error: apiError };
  }
}

/**
 * Type-safe mutation wrapper with error handling
 */
export async function withMutationErrorHandling<T>(
  mutationFn: () => Promise<T>,
  operationName: string = 'Operation'
): Promise<{ success: boolean; data?: T; error?: ApiError }> {
  try {
    const data = await mutationFn();
    return { success: true, data };
  } catch (error) {
    const apiError = parseApiError(error);
    logApiError(apiError, `Mutation: ${operationName}`);
    return { success: false, error: apiError };
  }
}

/**
 * Check if error is due to authentication/authorization
 */
export function isAuthError(error: ApiError): boolean {
  return (
    error.code === 'VALIDATION_ERROR' &&
    (error.message.includes('logged in') || error.message.includes('permission'))
  );
}

/**
 * Check if error is transient (retry-able)
 */
export function isTransientError(error: ApiError): boolean {
  return ['NETWORK_ERROR', 'TIMEOUT_ERROR'].includes(error.code);
}
