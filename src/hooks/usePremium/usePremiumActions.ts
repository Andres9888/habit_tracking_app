/**
 * usePremiumActions Hook
 *
 * Purchase, restore, and refresh actions for premium subscriptions.
 * Separated from data fetching for cleaner responsibility boundaries.
 */

import { useCallback, useEffect, useRef } from 'react';
import { isPurchasesAvailable, Purchases } from '../../lib/purchases';
import type {
  PurchasesPackage,
  CustomerInfo,
  PurchasesError,
} from 'react-native-purchases';

const PREMIUM_ENTITLEMENT_ID = 'premium';

interface PremiumActionsInput {
  setCustomerInfo: (info: CustomerInfo) => void;
  setError: (error: string | null) => void;
}

interface PremiumActionsReturn {
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  refreshStatus: () => Promise<void>;
}

export function usePremiumActions({
  setCustomerInfo,
  setError,
}: PremiumActionsInput): PremiumActionsReturn {
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const purchasePackage = useCallback(
    async (pkg: PurchasesPackage): Promise<boolean> => {
      if (!isPurchasesAvailable()) {
        if (isMountedRef.current) {
          setError('Purchases not available on this platform');
        }
        return false;
      }

      try {
        if (isMountedRef.current) {
          setError(null);
        }
        const { customerInfo: newInfo } = await Purchases.purchasePackage(pkg);
        
        if (!isMountedRef.current) return false;
        setCustomerInfo(newInfo);

        return (
          newInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined
        );
      } catch (error_) {
        const purchaseError = error_ as PurchasesError;
        if (purchaseError.userCancelled) return false;

        if (__DEV__) console.error('[usePremium] Purchase failed:', purchaseError);
        if (isMountedRef.current) {
          setError(purchaseError.message || 'Purchase failed');
        }
        return false;
      }
    },
    [setCustomerInfo, setError]
  );

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (!isPurchasesAvailable()) {
      if (isMountedRef.current) {
        setError('Purchases not available on this platform');
      }
      return false;
    }

    try {
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
        setError('Failed to restore purchases');
      }
      return false;
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
