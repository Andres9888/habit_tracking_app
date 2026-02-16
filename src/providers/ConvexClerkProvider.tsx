/**
 * Convex Clerk Provider
 * Syncs Clerk auth token with Convex client.
 * Exposes isConvexReady so children know when auth is available.
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
      return;
    }

    // Set auth token fetcher for Convex
    convexClient.setAuth(async () => {
      try {
        const token = await getToken({ template: 'convex' });
        return token ?? null;
      } catch (error) {
        if (__DEV__) console.warn('[ConvexClerkProvider] Failed to get Convex template token, trying default:', error);
        try {
          const defaultToken = await getToken();
          return defaultToken ?? null;
        } catch (fallbackError) {
          if (__DEV__) console.error('[ConvexClerkProvider] Failed to get auth token:', fallbackError);
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
