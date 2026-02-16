/**
 * PurchasesProvider - RevenueCat SDK Integration
 *
 * Manages RevenueCat SDK lifecycle and user identification based on
 * authentication state from Clerk.
 *
 * **Initialization Flow:**
 * 1. On mount: Initialize RevenueCat SDK (works for anonymous users)
 * 2. On sign in: Identify user to RevenueCat with Clerk user ID
 * 3. On sign out: Reset RevenueCat to anonymous state
 *
 * **Provider Order:**
 * Must be placed inside both ClerkProvider and ConvexClerkProvider
 * to access authentication state.
 *
 * @example
 * ```tsx
 * <ClerkProvider>
 *   <ConvexClerkProvider>
 *     <PurchasesProvider>
 *       <App />
 *     </PurchasesProvider>
 *   </ConvexClerkProvider>
 * </ClerkProvider>
 * ```
 *
 * **Architecture Note:**
 * This file is located in src/components/providers/ but should ideally
 * be in src/providers/ for consistency with other integration providers.
 * File move deferred to avoid breaking changes.
 *
 * @see lib/purchases for RevenueCat SDK wrapper functions
 */

import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import {
  initializePurchases,
  identifyUser,
  logoutPurchases,
} from '../../lib/purchases';

/**
 * Props for PurchasesProvider component
 */
interface PurchasesProviderProps {
  /** React children to render */
  children: React.ReactNode;
}

/**
 * PurchasesProvider Component
 *
 * Renders children while managing RevenueCat SDK state based on auth.
 * Does not provide a React Context - manages side effects only.
 *
 * @param props - Component props
 * @param props.children - Child components to render
 */
export function PurchasesProvider({ children }: PurchasesProviderProps) {
  const { isSignedIn, user } = useUser();

  // Initialize RevenueCat on mount (works for anonymous users too)
  useEffect(() => {
    initializePurchases().catch((error) => {
      if (__DEV__) console.warn('[PurchasesProvider] Failed to initialize:', error);
    });
  }, []);

  // Identify user when they sign in, reset when they sign out
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
