/**
 * Maps Clerk OAuth error codes to user-friendly messages.
 *
 * Error codes are documented at:
 * https://clerk.com/docs/custom-flows/error-handling
 */

import { ERROR_MESSAGES } from '../../../constants/errorMessages';

/** Clerk error structure from SDK */
export interface ClerkError {
  code?: string;
  message?: string;
  longMessage?: string;
  meta?: Record<string, unknown>;
}

/** Common OAuth error codes returned by Clerk */
export type OAuthErrorCode =
  | 'oauth_access_denied'
  | 'user_cancelled'
  | 'external_account_not_found'
  | 'external_account_exists'
  | 'email_address_not_found'
  | 'identifier_already_signed_in'
  | 'session_exists'
  | 'network_error'
  | 'unknown';

/** Result of error mapping */
export interface MappedError {
  /** User-friendly error message */
  message: string;
  /** Whether this is a cancellation (don't show error UI) */
  isCancellation: boolean;
  /** Whether user should be redirected (already signed in) */
  shouldRedirect: boolean;
  /** Original error code for debugging */
  code: OAuthErrorCode;
}

/** OAuth-specific error message map - keys are Clerk error codes */
const OAUTH_ERROR_MESSAGES: Record<OAuthErrorCode, string> = {
  email_address_not_found: ERROR_MESSAGES.AUTH.SIGN_IN_EMAIL_NOT_FOUND,
  external_account_exists: ERROR_MESSAGES.AUTH.SIGN_IN_EXTERNAL_ACCOUNT_EXISTS,
  external_account_not_found: ERROR_MESSAGES.AUTH.SIGN_IN_EXTERNAL_ACCOUNT_NOT_FOUND,
  identifier_already_signed_in: ERROR_MESSAGES.AUTH.SIGN_IN_ALREADY_SIGNED_IN,
  network_error: ERROR_MESSAGES.NETWORK.CONNECTION_ISSUE,
  oauth_access_denied: ERROR_MESSAGES.AUTH.SIGN_IN_CANCELLED,
  session_exists: ERROR_MESSAGES.AUTH.SIGN_IN_ALREADY_SIGNED_IN,
  unknown: ERROR_MESSAGES.AUTH.SIGN_IN_FAILED,
  user_cancelled: ERROR_MESSAGES.AUTH.SIGN_IN_CANCELLED,
};

/** Codes that indicate user cancellation (don't show error) */
const CANCELLATION_CODES = new Set<OAuthErrorCode>([
  'oauth_access_denied',
  'user_cancelled',
]);

/** Codes that indicate user should be redirected */
const REDIRECT_CODES = new Set<OAuthErrorCode>([
  'identifier_already_signed_in',
  'session_exists',
]);

/**
 * Determines if an error is a network-related error.
 */
function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('network')) {
    return true;
  }
  const errorObj = error as { message?: string };
  const message = errorObj?.message?.toLowerCase() ?? '';
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection')
  );
}

/**
 * Extracts Clerk error from various error shapes.
 */
function extractClerkError(error: unknown): ClerkError | null {
  const errorObj = error as {
    errors?: ClerkError[];
    clerkError?: boolean;
    code?: string;
    message?: string;
  };

  // Clerk SDK typically wraps errors in an array
  if (Array.isArray(errorObj?.errors) && errorObj.errors.length > 0) {
    return errorObj.errors[0];
  }

  // Direct error object with code
  if (errorObj?.code) {
    return { code: errorObj.code, message: errorObj.message };
  }

  return null;
}

/**
 * Maps a Clerk OAuth error to a user-friendly message and metadata.
 *
 * @param error - The error caught during OAuth flow
 * @returns Mapped error with user-friendly message and flags
 *
 * @example
 * ```ts
 * try {
 *   await startSSOFlow({ strategy: 'oauth_google' });
 * } catch (err) {
 *   const mapped = mapOAuthError(err);
 *   if (mapped.isCancellation) return; // Don't show error
 *   if (mapped.shouldRedirect) router.replace('/home');
 *   setError(mapped.message);
 * }
 * ```
 */
export function mapOAuthError(error: unknown): MappedError {
  // Check for network errors first
  if (isNetworkError(error)) {
    return {
      code: 'network_error',
      isCancellation: false,
      message: OAUTH_ERROR_MESSAGES.network_error,
      shouldRedirect: false,
    };
  }

  // Extract Clerk error structure
  const clerkError = extractClerkError(error);
  const errorCode = (clerkError?.code ?? 'unknown') as OAuthErrorCode;

  // Get message from map, or use Clerk's message, or fallback
  const message =
    OAUTH_ERROR_MESSAGES[errorCode] ??
    clerkError?.message ??
    OAUTH_ERROR_MESSAGES.unknown;

  return {
    code: errorCode,
    isCancellation: CANCELLATION_CODES.has(errorCode),
    message,
    shouldRedirect: REDIRECT_CODES.has(errorCode),
  };
}
