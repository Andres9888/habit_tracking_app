import { useSSO } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { mapOAuthError, MappedError } from '../utils';

// Warm up browser for better UX on Native Handset
WebBrowser.maybeCompleteAuthSession();

export type OAuthStrategy = 'oauth_google' | 'oauth_apple';

export interface OAuthResult {
  success: boolean;
  error?: string;
  errorDetails?: MappedError;
  missingFields?: string[];
}

export function useOAuthSignIn() {
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState<OAuthStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Warm up browser on Native Handset for faster OAuth
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const signInWith = useCallback(
    async (strategy: OAuthStrategy): Promise<OAuthResult> => {
      setIsLoading(strategy);
      setError(null);

      try {
        const { createdSessionId, setActive, signIn, signUp } =
          await startSSOFlow({
            redirectUrl: 'habit-tracker://sso-callback',
            strategy,
          });

        // If sign-in/sign-up completed successfully
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          return { success: true };
        }

        // Handle additional requirements (rare for OAuth)
        if (signUp?.status === 'missing_requirements') {
          return {
            missingFields: signUp.missingFields,
            success: false,
          };
        }

        // Handle any remaining sign-in tasks
        if (signIn?.status !== 'complete') {
          return {
            error: 'Sign in incomplete. Please try again.',
            success: false,
          };
        }

        return { success: true };
      } catch (error_: unknown) {
        const mappedError = mapOAuthError(error_);

        // User cancelled - don't show error
        if (mappedError.isCancellation) {
          return { success: false };
        }

        // User already signed in - could trigger redirect
        if (mappedError.shouldRedirect) {
          return { errorDetails: mappedError, success: false };
        }

        setError(mappedError.message);
        return {
          error: mappedError.message,
          errorDetails: mappedError,
          success: false,
        };
      } finally {
        setIsLoading(null);
      }
    },
    [startSSOFlow]
  );

  return {
    clearError: () => setError(null),
    error,
    isLoading,
    signInWithApple: () => signInWith('oauth_apple'),
    signInWithGoogle: () => signInWith('oauth_google'),
  };
}
