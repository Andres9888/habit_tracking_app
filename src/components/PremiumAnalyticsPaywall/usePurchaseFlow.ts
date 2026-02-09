/**
 * Purchase flow logic for PremiumAnalyticsPaywall
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import { usePremium } from '../../hooks/usePremium';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

interface UsePurchaseFlowParams {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function usePurchaseFlow({
  onSuccess,
  onClose,
}: UsePurchaseFlowParams = {}) {
  const { triggerSelection, triggerLightImpact, triggerSuccess } =
    useHapticFeedback({});
  const { monthlyPackage, packages, purchasePackage, restorePurchases } =
    usePremium();

  const annualPackage =
    packages?.find((p) => p.packageType === 'ANNUAL') ?? null;

  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(annualPackage);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = useCallback(async () => {
    if (isProcessing || !selectedPackage) return;

    triggerSelection();
    setIsProcessing(true);

    try {
      const success = await purchasePackage(selectedPackage);
      if (success) {
        triggerSuccess();
        onSuccess?.();
        onClose?.();
      }
    } catch (error) {
      Alert.alert(
        'Purchase Failed',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing,
    selectedPackage,
    triggerSelection,
    triggerSuccess,
    purchasePackage,
    onSuccess,
    onClose,
  ]);

  const handleRestore = useCallback(async () => {
    if (isProcessing) return;

    triggerLightImpact();
    setIsProcessing(true);

    try {
      const success = await restorePurchases();
      if (success) {
        triggerSuccess();
        Alert.alert('Success', 'Your purchases have been restored!', [
          { onPress: () => onClose?.(), text: 'OK' },
        ]);
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases found.', [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      Alert.alert('Restore Failed', 'Something went wrong.', [{ text: 'OK' }]);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, triggerLightImpact, triggerSuccess, restorePurchases, onClose]);

  return {
    annualPackage,
    handlePurchase,
    handleRestore,
    isProcessing,
    monthlyPackage,
    selectedPackage,
    setSelectedPackage,
  };
}
