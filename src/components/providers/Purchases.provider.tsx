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
import { useEffect } from 'react';

import { TIMEOUTS } from '../../lib/timing/config';
import { scheduleWhenIdle } from '../../lib/timing/scheduleWhenIdle';
import {
  identifyUser,
  initializePurchases,
  logoutPurchases,
} from '../../lib/purchases';

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
    return scheduleWhenIdle(
      () => {
        runPurchasesTask(initializePurchases(), 'initialize');
      },
      {
        fallbackDelayMs: TIMEOUTS.PURCHASES_INIT,
        timeoutMs: TIMEOUTS.REQUEST_IDLE_CALLBACK,
      }
    );
  }, []);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      runPurchasesTask(identifyUser(user.id), 'identify user');
      return;
    }

    if (!isSignedIn) {
      runPurchasesTask(logoutPurchases(), 'logout');
    }
  }, [isSignedIn, user?.id]);

  return children;
}
