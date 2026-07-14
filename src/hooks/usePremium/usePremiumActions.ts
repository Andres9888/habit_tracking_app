/**
 * usePremiumActions Hook
 *
 * Purchase, restore, and refresh actions for premium subscriptions.
 * Separated from data fetching for cleaner responsibility boundaries.
 */

import { useCallback, useEffect, useRef } from 'react';
import {
  createPurchasesUnavailableError,
  getPurchaseRuntimeInfo,
  isPurchasesAvailable,
  isPurchasesUnavailableError,
  Purchases,
} from '../../lib/purchases';
import type { PurchasesPackage, PurchasesError } from 'react-native-purchases';
import type {
  PremiumActionsInput,
  PremiumActionsReturn,
} from './usePremiumActions.types';

const PREMIUM_ENTITLEMENT_ID = 'premium';

export function usePremiumActions({
  setCustomerInfo,
  setError,
}: PremiumActionsInput): PremiumActionsReturn {
  const isMountedRef = useRef(true);
  const purchaseInFlightRef = useRef(false);
  const restoreInFlightRef = useRef(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const purchasePackage = useCallback(
    async (pkg: PurchasesPackage): Promise<boolean> => {
      if (purchaseInFlightRef.current) return false;
      purchaseInFlightRef.current = true;

      try {
        const runtimeInfo = getPurchaseRuntimeInfo();
        if (runtimeInfo.runtime !== 'native') {
          const message = runtimeInfo.message;
          if (isMountedRef.current) setError(message);
          throw createPurchasesUnavailableError();
        }
        if (isMountedRef.current) {
          setError(null);
        }
        const { customerInfo: newInfo } = await Purchases.purchasePackage(pkg);

        if (!isMountedRef.current) return false;
        setCustomerInfo(newInfo);

        if (newInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]) return true;

        const message =
          'Purchase completed, but premium access is not active yet';
        setError(message);
        throw new Error(message);
      } catch (error_) {
        const purchaseError = error_ as PurchasesError;
        if (purchaseError.userCancelled) return false;

        if (__DEV__)
          console.error('[usePremium] Purchase failed:', purchaseError);
        if (isMountedRef.current) {
          setError(
            isPurchasesUnavailableError(error_)
              ? error_.message
              : purchaseError.message || 'Purchase failed'
          );
        }
        throw error_;
      } finally {
        purchaseInFlightRef.current = false;
      }
    },
    [setCustomerInfo, setError]
  );

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (restoreInFlightRef.current) return false;
    restoreInFlightRef.current = true;

    try {
      const runtimeInfo = getPurchaseRuntimeInfo();
      if (runtimeInfo.runtime !== 'native') {
        const message = runtimeInfo.message;
        if (isMountedRef.current) setError(message);
        throw createPurchasesUnavailableError();
      }
      if (isMountedRef.current) {
        setError(null);
      }
      const info = await Purchases.restorePurchases();

      if (!isMountedRef.current) return false;
      setCustomerInfo(info);

      return info.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
    } catch (error_) {
      if (__DEV__) console.error('[usePremium] Restore failed:', error_);
      if (isMountedRef.current) {
        setError(
          isPurchasesUnavailableError(error_)
            ? error_.message
            : 'Failed to restore purchases'
        );
      }
      throw error_;
    } finally {
      restoreInFlightRef.current = false;
    }
  }, [setCustomerInfo, setError]);

  const refreshStatus = useCallback(async (): Promise<void> => {
    if (!isPurchasesAvailable()) return;

    try {
      const info = await Purchases.getCustomerInfo();

      if (!isMountedRef.current) return;
      setCustomerInfo(info);
    } catch (error_) {
      if (__DEV__) console.error('[usePremium] Refresh failed:', error_);
    }
  }, [setCustomerInfo]);

  return { purchasePackage, refreshStatus, restorePurchases };
}
