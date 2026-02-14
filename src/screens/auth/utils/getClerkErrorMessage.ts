type ClerkErrorItem = {
  message?: string;
};

type ClerkLikeError = {
  errors?: ClerkErrorItem[];
};

export const getClerkErrorMessage = (
  error: unknown,
  fallbackMessage: string
): string => {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const clerkError = error as ClerkLikeError;
    const firstMessage = clerkError.errors?.[0]?.message;

    if (typeof firstMessage === 'string' && firstMessage.trim().length > 0) {
      return firstMessage;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
};
