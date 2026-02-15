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

  // Initialize RevenueCat on mount (works for anonymous users too)
  useEffect(() => {
    initializePurchases().catch((error) => {
    });
  }, []);

  // Identify user when they sign in
  useEffect(() => {
    if (isSignedIn && user?.id) {
      identifyUser(user.id).catch((error) => {
      });
    } else if (!isSignedIn) {
      logoutPurchases().catch((error) => {
      });
    }
  }, [isSignedIn, user?.id]);

  return <>{children}</>;
}
