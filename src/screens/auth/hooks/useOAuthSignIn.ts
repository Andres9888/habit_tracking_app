import { useSSO } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';

// Warm up browser for better UX on Android
WebBrowser.maybeCompleteAuthSession();

export type OAuthStrategy = 'oauth_google' | 'oauth_apple';

export interface OAuthResult {
  success: boolean;
  error?: string;
  missingFields?: string[];
}

export function useOAuthSignIn() {
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState<OAuthStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Warm up browser on Android for faster OAuth
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
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
      } catch (err: unknown) {
        // Check if user cancelled the OAuth flow
        const errorObj = err as {
          errors?: Array<{ code?: string; message?: string }>;
          message?: string;
        };
        const clerkError = errorObj.errors?.[0];

        if (
          clerkError?.code === 'oauth_access_denied' ||
          clerkError?.code === 'user_cancelled'
        ) {
          // User cancelled - don't show error
          return { success: false };
        }

        const errorMessage =
          clerkError?.message ||
          errorObj.message ||
          'Failed to sign in. Please try again.';
        setError(errorMessage);
        return { error: errorMessage, success: false };
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
