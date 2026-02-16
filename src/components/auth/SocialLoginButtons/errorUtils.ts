import { ERROR_MESSAGES } from '../../../constants/errorMessages';

interface ClerkError {
  errors?: Array<{
    code?: string;
    message?: string;
    longMessage?: string;
  }>;
  message?: string;
}

/**
 * Converts OAuth errors into user-friendly messages
 * @param err - The error object from OAuth flow
 * @returns User-friendly error message or null if error should be ignored
 */
export const getErrorMessage = (err: unknown): string | null => {
  const clerkError = err as ClerkError;
  const errorCode = clerkError.errors?.[0]?.code;
  const errorMessage = clerkError.errors?.[0]?.message;
  const longMessage = clerkError.errors?.[0]?.longMessage;

  // User cancelled - don't show error
  if (errorCode === 'oauth_access_denied' || errorCode === 'user_cancelled') {
    return null;
  }

  // Already signed in
  if (errorCode === 'session_exists' || errorCode === 'identifier_already_signed_in') {
    return ERROR_MESSAGES.AUTH.SIGN_IN_ALREADY_SIGNED_IN;
  }

  // Network error
  if (clerkError.message?.includes('network') || errorCode === 'network_error') {
    return ERROR_MESSAGES.AUTH.SIGN_IN_NETWORK;
  }

  // External account issues
  if (errorCode === 'external_account_not_found') {
    return ERROR_MESSAGES.AUTH.SIGN_IN_EXTERNAL_ACCOUNT_NOT_FOUND;
  }
  if (errorCode === 'external_account_exists') {
    return ERROR_MESSAGES.AUTH.SIGN_IN_EXTERNAL_ACCOUNT_EXISTS;
  }

  // Email not found
  if (errorCode === 'email_address_not_found') {
    return ERROR_MESSAGES.AUTH.SIGN_IN_EMAIL_NOT_FOUND;
  }

  // Generic fallback - prefer long message if available
  return longMessage || errorMessage || ERROR_MESSAGES.AUTH.SIGN_IN_FAILED;
};
