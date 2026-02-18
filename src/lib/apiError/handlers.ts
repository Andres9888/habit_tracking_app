/**
 * API Error Handlers and Wrappers
 */

import { parseApiError } from './errorParser';
import type { ApiError, ApiResult } from './types';

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
    (error.message.includes('logged in') ||
      error.message.includes('permission'))
  );
}

/**
 * Check if error is transient (retry-able)
 */
export function isTransientError(error: ApiError): boolean {
  return ['NETWORK_ERROR', 'TIMEOUT_ERROR'].includes(error.code);
}
