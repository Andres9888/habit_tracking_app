/**
 * PurchasesProvider
 *
 * Initializes RevenueCat SDK when user is authenticated.
 * Must be placed inside ClerkProvider and ConvexClerkProvider.
 *
 * Performance optimizations:
 * - Defers initialization with requestIdleCallback to avoid blocking startup
 * - Only initializes when idle or after a short timeout
 */

import { useUser } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { PremiumProvider } from '../../hooks/usePremium';
import { TIMEOUTS } from '../../lib/timing/config';
import { scheduleWhenIdle } from '../../lib/timing/scheduleWhenIdle';
import {
  identifyUser,
  initializePurchases,
  isPurchasesAvailable,
  logoutPurchases,
} from '../../lib/purchases';

function logPurchasesTaskError(action: string) {
  return (error: unknown) => {
    if (__DEV__) {
      console.warn(`[PurchasesProvider] Failed to ${action}:`, error);
    }
  };
}

// eslint-disable-next-line max-lines-per-function
export function PurchasesProvider({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn, user } = useUser();
  const identityKey = isLoaded && isSignedIn ? (user?.id ?? null) : null;
  const [readyIdentityKey, setReadyIdentityKey] = useState<string | null>(null);

  useEffect(() => {
    setReadyIdentityKey(null);
    if (!isLoaded) return;
    if (!identityKey) {
      if (isPurchasesAvailable()) {
        void logoutPurchases();
      }
      return;
    }

    let cancelled = false;
    const cancelScheduledSync = scheduleWhenIdle(
      () => {
        void (async () => {
          try {
            const wasInitialized = isPurchasesAvailable();
            const initialized = await initializePurchases(identityKey);
            if (cancelled || !initialized) return;
            const identified = wasInitialized
              ? await identifyUser(identityKey)
              : true;
            if (!cancelled && identified && isPurchasesAvailable()) {
              setReadyIdentityKey(identityKey);
            }
          } catch (error) {
            logPurchasesTaskError('synchronize customer')(error);
          }
        })();
      },
      {
        fallbackDelayMs: TIMEOUTS.PURCHASES_INIT,
        timeoutMs: TIMEOUTS.REQUEST_IDLE_CALLBACK,
      }
    );
    return () => {
      cancelled = true;
      cancelScheduledSync();
    };
  }, [identityKey, isLoaded]);

  return (
    <PremiumProvider
      enabled={identityKey === null ? false : readyIdentityKey === identityKey}
      identityKey={identityKey}
    >
      {children}
    </PremiumProvider>
  );
}
