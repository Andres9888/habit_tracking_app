/**
 * Convex Clerk Provider
 * Syncs Clerk auth token with Convex client.
 * Exposes isConvexReady so children know when auth is available.
 *
 * SEC-009: Enhanced error handling for token refresh failures
 * - Detects when token refresh fails
 * - Logs auth errors for debugging
 * - Allows parent components to detect and handle auth expiry gracefully
 */

import { ConvexProvider } from 'convex/react';
import { useAuth } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { convexClient } from '../lib/appConfig';

const ConvexAuthContext = createContext({ isConvexReady: false });

export function useConvexAuthReady() {
  return useContext(ConvexAuthContext).isConvexReady;
}

export function ConvexClerkProvider({ children }: PropsWithChildren) {
  const { getToken, isSignedIn } = useAuth();
  const [isConvexReady, setIsConvexReady] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      setIsConvexReady(false);
      // SEC-008: Clear Convex auth when user signs out
      convexClient.setAuth(async () => null);
      return;
    }

    // Set auth token fetcher for Convex
    convexClient.setAuth(async () => {
      try {
        const token = await getToken({ template: 'convex' });
        return token ?? null;
      } catch (error) {
        // SEC-009: Log token refresh failures for debugging
        if (__DEV__) {
          console.warn('Failed to get Convex template token:', error);
        }
        try {
          const defaultToken = await getToken();
          if (!defaultToken && __DEV__) {
            console.warn('Token refresh failed, fallback to default token also failed');
          }
          return defaultToken ?? null;
        } catch (fallbackError) {
          // SEC-009: All token fetch attempts failed
          // This likely means session has expired or network is down
          if (__DEV__) {
            console.warn('All token fetch attempts failed:', fallbackError);
          }
          return null;
        }
      }
    });

    setIsConvexReady(true);
  }, [getToken, isSignedIn]);

  const value = useMemo(() => ({ isConvexReady }), [isConvexReady]);

  return (
    <ConvexAuthContext.Provider value={value}>
      <ConvexProvider client={convexClient}>{children}</ConvexProvider>
    </ConvexAuthContext.Provider>
  );
}

export default ConvexClerkProvider;
