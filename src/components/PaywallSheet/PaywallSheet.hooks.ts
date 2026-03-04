/**
 * Business logic for PaywallSheet — wires to RevenueCat via usePremium
 */

import { useCallback, useState } from 'react';
import { usePremium } from '../../hooks/usePremium';

export function usePaywallSheet(
  onClose: () => void,
  onPurchaseSuccess?: () => void
) {
  const { monthlyPackage, purchasePackage, priceString } = usePremium();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = useCallback(async () => {
    if (!monthlyPackage || isPurchasing) return;
    setIsPurchasing(true);
    try {
      const success = await purchasePackage(monthlyPackage);
      if (success) {
        onPurchaseSuccess?.();
        onClose();
      }
    } finally {
      setIsPurchasing(false);
    }
  }, [monthlyPackage, isPurchasing, purchasePackage, onClose, onPurchaseSuccess]);

  const isDisabled = isPurchasing || !monthlyPackage;
  return { handlePurchase, isDisabled, isPurchasing, priceString };
}
