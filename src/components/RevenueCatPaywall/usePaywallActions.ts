/**
 * usePaywallActions — purchase and restore handlers
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

interface Params {
  onClose: () => void;
  onPurchaseSuccess: () => void;
  onRestoreSuccess: () => void;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

export function usePaywallActions({ onClose, onPurchaseSuccess, onRestoreSuccess, purchasePackage, restorePurchases }: Params) {
  const { triggerSelection, triggerLightImpact, triggerSuccess, triggerError } =
    useHapticFeedback({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = useCallback(
    async (selectedPackage: PurchasesPackage | null) => {
      if (isProcessing || !selectedPackage) return;
      triggerSelection();
      setIsProcessing(true);
      try {
        const success = await purchasePackage(selectedPackage);
        if (success) {
          triggerSuccess();
          onPurchaseSuccess();
          onClose();
        }
      } catch {
        Alert.alert('Purchase Failed', 'Please check your payment method and try again.', [
          { text: 'OK' },
        ]);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, purchasePackage, onPurchaseSuccess, onClose, triggerSelection, triggerSuccess],
  );

  const handleRestore = useCallback(async () => {
    if (isProcessing) return;
    triggerLightImpact();
    setIsProcessing(true);
    try {
      const success = await restorePurchases();
      if (success) {
        triggerSuccess();
        Alert.alert('Purchases Restored', 'Your premium access has been restored!', [
          {
            onPress: () => {
              onRestoreSuccess();
              onClose();
            },
            text: 'Great!',
          },
        ]);
      } else {
        Alert.alert('No Purchases Found', 'We couldn\u2019t find any previous purchases.', [
          { text: 'OK' },
        ]);
      }
    } catch {
      triggerError?.();
      Alert.alert('Restore Failed', 'Please try again or contact support.', [{ text: 'OK' }]);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, restorePurchases, onRestoreSuccess, onClose, triggerLightImpact, triggerSuccess, triggerError]);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);

  return { handleClose, handlePurchase, handleRestore, isProcessing };
}
