interface ClerkError {
  errors?: Array<{
    code?: string;
    message?: string;
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

  if (errorCode === 'session_exists') {
    return 'You are already signed in. Please sign out and try again.';
  }
  if (errorCode === 'oauth_access_denied') {
    return 'Access was denied. Please try again or use a different sign-in method.';
  }
  if (
    errorMessage?.includes('cancelled') ||
    errorMessage?.includes('canceled')
  ) {
    return null;
  }
  if (clerkError.message?.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }

  return errorMessage || 'An unexpected error occurred. Please try again.';
};
