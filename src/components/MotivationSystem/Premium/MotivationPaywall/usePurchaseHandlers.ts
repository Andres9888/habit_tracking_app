/**
 * Custom hook for handling purchase logic in paywalls
 */

import { useState, useEffect, useCallback } from 'react';
import type { PurchasesPackage } from 'react-native-purchases';
import { usePremium } from '../../../../hooks/usePremium';

interface UsePurchaseHandlersParams {
  onStartTrial?: () => Promise<boolean>;
  onRestorePurchases?: () => Promise<boolean>;
}

export function usePurchaseHandlers({
  onStartTrial,
  onRestorePurchases,
}: UsePurchaseHandlersParams = {}) {
  const { monthlyPackage, annualPackage, purchasePackage, restorePurchases } =
    usePremium();

  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);

  // Update selected package when annualPackage loads
  useEffect(() => {
    if (annualPackage && !selectedPackage) {
      setSelectedPackage(annualPackage);
    }
  }, [annualPackage, selectedPackage]);

  // Wrap onStartTrial to use selected package
  const wrappedOnStartTrial = useCallback(async () => {
    if (onStartTrial) {
      return onStartTrial();
    }

    if (!selectedPackage) {
      console.warn('[usePurchaseHandlers] No package selected');
      return false;
    }
    return purchasePackage(selectedPackage);
  }, [onStartTrial, selectedPackage, purchasePackage]);

  // Wrap restore purchases
  const wrappedRestorePurchases = useCallback(async () => {
    if (onRestorePurchases) {
      return onRestorePurchases();
    }
    return restorePurchases();
  }, [onRestorePurchases, restorePurchases]);

  return {
    annualPackage,
    monthlyPackage,
    selectedPackage,
    setSelectedPackage,
    wrappedOnStartTrial,
    wrappedRestorePurchases,
  };
}
