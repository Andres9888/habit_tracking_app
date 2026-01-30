/**
 * Convex Clerk Provider
 * Syncs Clerk auth token with Convex client.
 */

import { ConvexProvider } from 'convex/react';
import { useAuth } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { convexClient } from '../lib/appConfig';

export function ConvexClerkProvider({ children }: PropsWithChildren) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    // Set auth token fetcher for Convex
    convexClient.setAuth(async () => {
      if (!isSignedIn) {
        return null;
      }

      try {
        // Get the Clerk token with 'convex' JWT template
        const token = await getToken({ template: 'convex' });
        return token ?? null;
      } catch {
        // Fallback to default token if template doesn't exist
        try {
          const defaultToken = await getToken();
          return defaultToken ?? null;
        } catch {
          return null;
        }
      }
    });
  }, [getToken, isSignedIn]);

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}

export default ConvexClerkProvider;
