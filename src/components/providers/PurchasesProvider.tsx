/**
 * PurchasesProvider
 *
 * Initializes RevenueCat SDK when user is authenticated.
 * Must be placed inside ClerkProvider and ConvexClerkProvider.
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

  useEffect(() => {
    if (isSignedIn && user?.id) {
      // Initialize with Clerk user ID for cross-device sync
      initializePurchases(user.id)
        .then(() => identifyUser(user.id))
        .catch((error) => {
          // Log but don't crash - purchases are optional
          console.warn('[PurchasesProvider] Failed to initialize:', error);
        });
    } else if (!isSignedIn) {
      // Clear user on logout
      logoutPurchases().catch((error) => {
        console.warn('[PurchasesProvider] Failed to logout:', error);
      });
    }
  }, [isSignedIn, user?.id]);

  return <>{children}</>;
}
