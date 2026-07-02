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
import { setBackgroundSyncTokenProvider } from '../lib/offline/backgroundSync';

const ConvexAuthContext = createContext({ isConvexReady: false });

export function useConvexAuthReady() {
  return useContext(ConvexAuthContext).isConvexReady;
}

// eslint-disable-next-line max-lines-per-function
export function ConvexClerkProvider({ children }: PropsWithChildren) {
  const { getToken, isSignedIn } = useAuth();
  const [isConvexReady, setIsConvexReady] = useState(false);
  const convexClientInstance = convexClient;
  const isConvexClientConfigured = convexClientInstance !== null;

  useEffect(() => {
    if (!isConvexClientConfigured) {
      setIsConvexReady(false);
      return;
    }

    if (!isSignedIn) {
      setIsConvexReady(false);
      return;
    }

    // Set auth token fetcher for Convex
    const fetchConvexToken = async () => {
      try {
        const token = await getToken({ template: 'convex' });
        return token ?? null;
      } catch {
        try {
          const defaultToken = await getToken();
          return defaultToken ?? null;
        } catch {
          return null;
        }
      }
    };

    convexClientInstance.setAuth(fetchConvexToken);
    setBackgroundSyncTokenProvider(fetchConvexToken);

    setIsConvexReady(true);

    return () => setBackgroundSyncTokenProvider(null);
  }, [getToken, isSignedIn]);

  const value = useMemo(() => ({ isConvexReady }), [isConvexReady]);

  if (!isConvexClientConfigured) {
    if (__DEV__) {
      console.warn('[ConvexClerkProvider] Missing EXPO_PUBLIC_CONVEX_URL');
    }

    return (
      <ConvexAuthContext.Provider value={value}>
        {children}
      </ConvexAuthContext.Provider>
    );
  }

  return (
    <ConvexAuthContext.Provider value={value}>
      <ConvexProvider client={convexClientInstance}>{children}</ConvexProvider>
    </ConvexAuthContext.Provider>
  );
}

export default ConvexClerkProvider;
