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

import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import {
  initializePurchases,
  identifyUser,
  logoutPurchases,
} from '../../lib/purchases';

interface PurchasesProviderProps {
  children: React.ReactNode;
}

export function PurchasesProvider({ children }: PurchasesProviderProps) {
  const { isSignedIn, user } = useUser();

  // Initialize RevenueCat after idle callback to avoid blocking startup
  useEffect(() => {
    const initPurchases = () => {
      const result = initializePurchases();
      if (result && typeof (result as Promise<unknown>).catch === 'function') {
        result.catch((error) => {
          if (__DEV__) console.warn('[PurchasesProvider] Failed to initialize:', error);
        });
      }
    };

    if (typeof requestIdleCallback === 'function') {
      const handle = requestIdleCallback(initPurchases, { timeout: 2000 });
      return () => cancelIdleCallback(handle);
    } else {
      // Fallback: defer for 500ms
      const timer = setTimeout(initPurchases, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Identify user when they sign in
  useEffect(() => {
    if (isSignedIn && user?.id) {
      const result = identifyUser(user.id);
      if (result && typeof (result as Promise<unknown>).catch === 'function') {
        result.catch((error) => {
          if (__DEV__) console.warn('[PurchasesProvider] Failed to identify user:', error);
        });
      }
    } else if (!isSignedIn) {
      const result = logoutPurchases();
      if (result && typeof (result as Promise<unknown>).catch === 'function') {
        result.catch((error) => {
          if (__DEV__) console.warn('[PurchasesProvider] Failed to logout:', error);
        });
      }
    }
  }, [isSignedIn, user?.id]);

  return <>{children}</>;
}
