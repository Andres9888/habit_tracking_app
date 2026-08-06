/**
 * Convex Clerk Provider
 * Syncs Clerk auth token with Convex client.
 * Exposes isConvexReady so children know when auth is available.
 */

import { ConvexProvider } from 'convex/react';
import { useAuth } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { convexClient } from '../lib/appConfig';
import { setBackgroundSyncTokenProvider } from '../lib/offline/backgroundSync';
import { ConvexAuthReadyContext } from './ConvexAuthReady.context';

// eslint-disable-next-line max-lines-per-function
export function ConvexClerkProvider({ children }: PropsWithChildren) {
  const { getToken, isSignedIn } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;
  const [isConvexReady, setIsConvexReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const convexClientInstance = convexClient;
  const isConvexClientConfigured = convexClientInstance !== null;
  const retryConvexAuth = useCallback(() => setRetryCount((n) => n + 1), []);

  useEffect(() => {
    if (!isConvexClientConfigured) {
      setIsConvexReady(false);
      return;
    }

    if (!isSignedIn) {
      convexClientInstance.clearAuth();
      setIsConvexReady(false);
      return;
    }

    // Set auth token fetcher for Convex
    const fetchConvexToken = async () => {
      try {
        const token = await getTokenRef.current({ template: 'convex' });
        return token ?? null;
      } catch {
        try {
          const defaultToken = await getTokenRef.current();
          return defaultToken ?? null;
        } catch {
          return null;
        }
      }
    };

    let isCurrent = true;
    setIsConvexReady(false);
    convexClientInstance.setAuth(fetchConvexToken, (isAuthenticated) => {
      if (isCurrent) setIsConvexReady(isAuthenticated);
    });
    setBackgroundSyncTokenProvider(fetchConvexToken);

    return () => {
      isCurrent = false;
      setBackgroundSyncTokenProvider(null);
    };
    // retryCount re-runs setAuth so a stuck connection gets a fresh token and
    // a new socket instead of waiting on Convex's own backoff.
  }, [isConvexClientConfigured, isSignedIn, retryCount]);

  const value = useMemo(
    () => ({ isConvexReady, retryConvexAuth }),
    [isConvexReady, retryConvexAuth]
  );

  if (!isConvexClientConfigured) {
    if (__DEV__) {
      console.warn('[ConvexClerkProvider] Missing EXPO_PUBLIC_CONVEX_URL');
    }

    return (
      <ConvexAuthReadyContext.Provider value={value}>
        {children}
      </ConvexAuthReadyContext.Provider>
    );
  }

  return (
    <ConvexAuthReadyContext.Provider value={value}>
      <ConvexProvider client={convexClientInstance}>{children}</ConvexProvider>
    </ConvexAuthReadyContext.Provider>
  );
}

export default ConvexClerkProvider;
