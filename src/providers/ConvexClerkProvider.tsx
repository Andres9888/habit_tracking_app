/**
 * Convex–Clerk Auth Bridge
 *
 * Syncs the Clerk session token with the Convex client so that
 * authenticated queries/mutations work seamlessly.
 *
 * Exposes `isConvexReady` via context so downstream components can
 * gate on the auth handshake being complete.
 */

import { ConvexProvider } from 'convex/react';
import { useAuth } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { convexClient } from '../lib/appConfig';

const ConvexAuthContext = createContext({ isConvexReady: false });

/**
 * Returns `{ isConvexReady }` — `true` once the Clerk token has been
 * forwarded to the Convex client and it's safe to run authenticated
 * queries. Use this to show loading states before data is available.
 */
export function useConvexAuthReady() {
  return useContext(ConvexAuthContext).isConvexReady;
}

// ---------------------------------------------------------------------------
// Token fetcher
// ---------------------------------------------------------------------------

/**
 * Creates a token-fetching function for `convexClient.setAuth()`.
 *
 * Tries the `convex` JWT template first (custom claims for Convex's auth
 * model). Falls back to the default Clerk token if the template isn't
 * configured — this keeps local dev working without extra setup.
 */
function createTokenFetcher(
  getToken: ReturnType<typeof useAuth>['getToken']
): () => Promise<string | null> {
  return async () => {
    try {
      return (await getToken({ template: 'convex' })) ?? null;
    } catch {
      // Template may not exist in dev — fall back to default token.
      try {
        return (await getToken()) ?? null;
      } catch {
        return null;
      }
    }
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ConvexClerkProvider({ children }: PropsWithChildren) {
  const { getToken, isSignedIn } = useAuth();
  const [isConvexReady, setIsConvexReady] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      setIsConvexReady(false);
      return;
    }

    convexClient.setAuth(createTokenFetcher(getToken));
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
