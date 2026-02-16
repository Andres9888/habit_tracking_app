/**
 * PurchasesProvider
 *
 * Initializes RevenueCat SDK when user is authenticated.
 * Must be placed inside ClerkProvider and ConvexClerkProvider.
 *
 * Defers initialization to requestIdleCallback to avoid blocking
 * critical app startup path.
 */

import { memo, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-expo';
import {
  initializePurchases,
  identifyUser,
  logoutPurchases,
} from '../../lib/purchases';

interface PurchasesProviderProps {
  children: React.ReactNode;
}

function PurchasesProviderImpl({ children }: PurchasesProviderProps) {
  const { isSignedIn, user } = useUser();
  const initRef = useRef(false);

  // Defer RevenueCat initialization to requestIdleCallback to avoid blocking
  // the critical startup path. This improves Time to Interactive.
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initAsync = () => {
      initializePurchases().catch((error) => {
        if (__DEV__) console.warn('[PurchasesProvider] Failed to initialize:', error);
      });
    };

    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(initAsync, { timeout: 5000 });
    } else {
      setTimeout(initAsync, 1000);
    }
  }, []);

  // Identify user when they sign in
  useEffect(() => {
    if (isSignedIn && user?.id) {
      identifyUser(user.id).catch((error) => {
        if (__DEV__) console.warn('[PurchasesProvider] Failed to identify user:', error);
      });
    } else if (!isSignedIn) {
      logoutPurchases().catch((error) => {
        if (__DEV__) console.warn('[PurchasesProvider] Failed to logout:', error);
      });
    }
  }, [isSignedIn, user?.id]);

  return <>{children}</>;
}

/**
 * Memoized PurchasesProvider to prevent unnecessary re-renders
 * when parent providers update but PurchasesProvider logic hasn't changed.
 */
export const PurchasesProvider = memo(PurchasesProviderImpl);
