/**
 * PurchasesProvider
 *
 * Initializes RevenueCat SDK when user is authenticated.
 * Must be placed inside ClerkProvider and ConvexClerkProvider.
 *
 * Performance optimizations:
 * - Defers authenticated SDK initialization until the main thread is idle
 * - Cancels a pending identity task when the Clerk user changes
 */

import { useUser } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { TIMEOUTS } from '../../lib/timing/config';
import { scheduleWhenIdle } from '../../lib/timing/scheduleWhenIdle';
import { identifyUser, logoutPurchases } from '../../lib/purchases';

function logPurchasesTaskError(action: string) {
  return (error: unknown) => {
    if (__DEV__) {
      console.warn(`[PurchasesProvider] Failed to ${action}:`, error);
    }
  };
}

function runPurchasesTask(task: Promise<void>, action: string): void {
  void task.catch(logPurchasesTaskError(action));
}

export function PurchasesProvider({ children }: PropsWithChildren) {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user?.id) {
      const userId = user.id;
      return scheduleWhenIdle(
        () => runPurchasesTask(identifyUser(userId), 'identify user'),
        {
          fallbackDelayMs: TIMEOUTS.PURCHASES_INIT,
          timeoutMs: TIMEOUTS.REQUEST_IDLE_CALLBACK,
        }
      );
    }

    if (isSignedIn === false) {
      // Logout is deliberately not deferred: account changes must not leave the
      // previous user's entitlement identity active during the idle window.
      runPurchasesTask(logoutPurchases(), 'logout');
      return;
    }
  }, [isSignedIn, user?.id]);

  return children;
}
