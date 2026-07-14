/**
 * Business logic for PaywallSheet — wires to RevenueCat via usePremium
 */

import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { usePremium } from '../../hooks/usePremium';

export function usePaywallSheet(
  onClose: () => void,
  onPurchaseSuccess?: () => void
) {
  const { monthlyPackage, purchasePackage, priceString } = usePremium();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const purchaseInFlightRef = useRef(false);

  const handlePurchase = useCallback(async () => {
    if (!monthlyPackage || purchaseInFlightRef.current) return;
    purchaseInFlightRef.current = true;
    setIsPurchasing(true);
    try {
      const success = await purchasePackage(monthlyPackage);
      if (success) {
        onPurchaseSuccess?.();
        onClose();
      }
    } catch {
      Alert.alert(
        'Purchase Failed',
        'Please check your payment method and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      purchaseInFlightRef.current = false;
      setIsPurchasing(false);
    }
  }, [monthlyPackage, purchasePackage, onClose, onPurchaseSuccess]);

  const isDisabled = isPurchasing || !monthlyPackage;
  return { handlePurchase, isDisabled, isPurchasing, priceString };
}
