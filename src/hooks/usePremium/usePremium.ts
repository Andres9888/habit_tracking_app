/**
 * usePremium Hook
 *
 * Core hook for managing premium subscriptions via RevenueCat.
 * Handles:
 * - Fetching subscription status
 * - Loading available offerings/packages
 * - Processing purchases
 * - Restoring purchases
 * - Syncing premium status to Convex
 *
 * @example
 * const { isPremium, monthlyPackage, purchasePackage, priceString } = usePremium();
 *
 * if (!isPremium && monthlyPackage) {
 *   await purchasePackage(monthlyPackage);
 * }
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { isPurchasesAvailable, Purchases } from '../../lib/purchases';
import { PACKAGE_TYPE } from 'react-native-purchases';
import type { UsePremiumReturn, SubscriptionStatus } from './types';

// Import types for TypeScript
import type {
  PurchasesPackage,
  CustomerInfo,
  PurchasesError,
} from 'react-native-purchases';

const PREMIUM_ENTITLEMENT_ID = 'premium';

export function usePremium(): UsePremiumReturn {
  // State - use any for types when SDK not available
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listenerRef = useRef<{ remove: () => void } | null>(null);

  // Derive premium status from RevenueCat entitlements
  const premiumEntitlement =
    customerInfo?.entitlements.active[PREMIUM_ENTITLEMENT_ID];
  const isPremium = premiumEntitlement !== undefined;

  // Derive subscription status
  const status: SubscriptionStatus = (() => {
    if (isLoading) return 'loading';
    if (error) return 'error';
    if (!customerInfo) return 'free';
    if (premiumEntitlement?.periodType === 'TRIAL') return 'trialing';
    if (isPremium) return 'active';
    return 'free';
  })();

  // Note: Convex sync is handled by the RevenueCat webhook (convex/router.ts)
  // The webhook updates userSettings.hasPremium when purchases/cancellations occur
  // This avoids infinite loop issues from client-side sync

  // Fetch customer info and offerings on mount
  // Uses polling to wait for SDK initialization (handles race condition with PurchasesProvider)
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 10;
    const retryDelay = 500; // ms

    async function fetchData() {
      // Wait for SDK to be available (handles race condition)
      while (!isPurchasesAvailable() && retryCount < maxRetries) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log(`[usePremium] SDK not available yet, retry ${retryCount + 1}/${maxRetries}...`);
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retryCount++;
      }

      if (!isPurchasesAvailable()) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('[usePremium] SDK not available after retries, giving up');
        }
        if (isMounted) {
          setIsLoading(false);
          setIsLoadingOfferings(false);
        }
        return;
      }

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('[usePremium] SDK available, fetching data...');
      }
      try {
        // Fetch customer info and offerings in parallel
        const [info, offeringsResult] = await Promise.all([
          Purchases.getCustomerInfo(),
          Purchases.getOfferings(),
        ]);

        // Debug logging for offerings
        if (__DEV__) {
          /* eslint-disable no-console */
          console.log('[usePremium] === OFFERINGS DEBUG ===');
          console.log('[usePremium] All offerings:', Object.keys(offeringsResult.all || {}));
          console.log('[usePremium] Current offering:', offeringsResult.current?.identifier ?? 'NONE');
          console.log('[usePremium] Available packages:', offeringsResult.current?.availablePackages?.length ?? 0);

          if (offeringsResult.current?.availablePackages) {
            offeringsResult.current.availablePackages.forEach((pkg, i) => {
              console.log(`[usePremium] Package ${i}: ${pkg.identifier} - ${pkg.product.identifier} - ${pkg.product.priceString}`);
            });
          } else {
            console.log('[usePremium] ⚠️ No packages available in current offering');
          }

          // Debug logging for customer info
          console.log('[usePremium] === CUSTOMER INFO DEBUG ===');
          console.log('[usePremium] Original App User ID:', info.originalAppUserId);
          console.log('[usePremium] Active entitlements:', Object.keys(info.entitlements.active));
          console.log('[usePremium] All entitlements:', Object.keys(info.entitlements.all));
          /* eslint-enable no-console */
        }

        if (isMounted) {
          setCustomerInfo(info);
          setPackages(offeringsResult.current?.availablePackages ?? null);
        }
      } catch (e) {
        console.error('[usePremium] Failed to fetch data:', e);
        console.error('[usePremium] Error details:', JSON.stringify(e, null, 2));
        if (isMounted) {
          setError('Failed to load subscription info');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsLoadingOfferings(false);
        }
      }
    }

    // Set up listener BEFORE fetch to avoid race condition
    // The listener will catch any updates that happen during or after fetch
    const setupListener = () => {
      if (isPurchasesAvailable() && !listenerRef.current) {
        try {
          listenerRef.current = Purchases.addCustomerInfoUpdateListener(
            (info: CustomerInfo) => {
              if (isMounted) {
                if (__DEV__) {
                  // eslint-disable-next-line no-console
                  console.log('[usePremium] Customer info updated via listener');
                }
                setCustomerInfo(info);
              }
            }
          );
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('[usePremium] Listener attached successfully');
          }
        } catch (e) {
          console.error('[usePremium] Failed to add listener:', e);
        }
      }
    };

    fetchData().then(() => {
      // Set up listener after SDK is confirmed available
      if (isMounted) {
        setupListener();
      }
    });

    return () => {
      isMounted = false;
      if (listenerRef.current) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('[usePremium] Removing listener on cleanup');
        }
        listenerRef.current.remove();
        listenerRef.current = null;
      }
    };
  }, []);

  // Purchase a package
  const purchasePackage = useCallback(
    async (pkg: PurchasesPackage): Promise<boolean> => {
      if (!isPurchasesAvailable()) {
        setError('Purchases not available on this platform');
        return false;
      }

      try {
        setError(null);
        const { customerInfo: newInfo } = await Purchases.purchasePackage(pkg);
        setCustomerInfo(newInfo);

        const success =
          newInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log(
            '[usePremium] Purchase result:',
            success ? 'SUCCESS' : 'NO ENTITLEMENT'
          );
        }
        return success;
      } catch (e) {
        const purchaseError = e as PurchasesError;

        // Don't show error if user cancelled
        if (purchaseError.userCancelled) {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('[usePremium] Purchase cancelled by user');
          }
          return false;
        }

        console.error('[usePremium] Purchase failed:', purchaseError);
        setError(purchaseError.message || 'Purchase failed');
        return false;
      }
    },
    []
  );

  // Restore purchases
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (!isPurchasesAvailable()) {
      setError('Purchases not available on this platform');
      return false;
    }

    try {
      setError(null);
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);

      const success =
        info.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('[usePremium] Restore result:', success ? 'FOUND' : 'NONE');
      }
      return success;
    } catch (e) {
      console.error('[usePremium] Restore failed:', e);
      setError('Failed to restore purchases');
      return false;
    }
  }, []);

  // Refresh subscription status
  const refreshStatus = useCallback(async (): Promise<void> => {
    if (!isPurchasesAvailable()) return;

    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (e) {
      console.error('[usePremium] Refresh failed:', e);
    }
  }, []);

  // Find monthly package
  const monthlyPackage =
    packages?.find((p) => p.packageType === PACKAGE_TYPE.MONTHLY) ?? null;

  // Get formatted price string
  const priceString = monthlyPackage?.product.priceString ?? null;

  // Subscription info
  const expirationDate = premiumEntitlement?.expirationDate
    ? new Date(premiumEntitlement.expirationDate)
    : null;
  const isTrialActive = premiumEntitlement?.periodType === 'TRIAL';
  const managementUrl = customerInfo?.managementURL ?? null;

  return {
    // State
    isPremium,
    status,
    isLoading,
    error,

    // Offerings
    packages,
    monthlyPackage,
    priceString,
    isLoadingOfferings,

    // Actions
    purchasePackage,
    restorePurchases,
    refreshStatus,

    // Subscription info
    expirationDate,
    isTrialActive,
    managementUrl,
    customerInfo,
  };
}
