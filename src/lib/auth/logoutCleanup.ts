/**
 * Centralized logout cleanup
 *
 * Ensures all sensitive data is purged from the device on sign-out.
 * This prevents stale tokens, cached user data, or session artifacts
 * from persisting after logout.
 *
 * Security: SEC-001 — Token & session cleanup on logout
 */

import * as SecureStore from 'expo-secure-store';

import { convexClient, tokenCache } from '../appConfig';
import { logoutPurchases } from '../purchases';

/**
 * Known SecureStore keys used by Clerk and the app.
 * Clerk stores tokens under `__clerk_client_jwt` by convention;
 * additional keys may be added as the app evolves.
 */
const SECURE_STORE_AUTH_KEYS = [
  '__clerk_client_jwt',
  '__clerk_client_uat',
] as const;

/**
 * Perform full logout cleanup.
 *
 * Call this *before* or alongside `clerk.signOut()` to ensure
 * no sensitive material survives the session transition.
 *
 * @returns void — errors are caught and logged in dev; never throws in production.
 */
export async function performLogoutCleanup(): Promise<void> {
  const results = await Promise.allSettled([
    // 1. Clear cached auth tokens from SecureStore
    ...SECURE_STORE_AUTH_KEYS.map((key) => tokenCache.deleteToken(key)),

    // 2. Disconnect Convex auth so no further authenticated
    //    queries/mutations fire with a stale token
    Promise.resolve(convexClient.clearAuth()),

    // 3. Clear RevenueCat user association
    logoutPurchases(),
  ]);

  if (__DEV__) {
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.warn(`[logoutCleanup] Step ${i} failed:`, r.reason);
      }
    });
  }
}
