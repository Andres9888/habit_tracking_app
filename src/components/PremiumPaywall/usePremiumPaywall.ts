/**
 * usePremiumPaywall Hook
 *
 * Unified purchase/restore logic for all paywall variants.
 */

import { useCallback, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { usePremium } from '../../hooks/usePremium';
import { useRestorePurchases } from './useRestorePurchases';
import type { PaywallVariant } from './PremiumPaywall.types';

interface Params {
  variant: PaywallVariant;
  onClose: () => void;
  onStartTrial: () => void | Promise<boolean>;
  onRestorePurchases?: () => Promise<boolean>;
}

export function usePremiumPaywall({ variant, onClose, onStartTrial, onRestorePurchases }: Params) {
  const { triggerSelection, triggerLightImpact, triggerSuccess } = useHapticFeedback({});
  const { monthlyPackage, packages, priceString, isLoadingOfferings, purchasePackage } =
    usePremium();

  const annualPackage = packages?.find((p) => p.packageType === 'ANNUAL') ?? null;
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    if (!selectedPackage && annualPackage) setSelectedPackage(annualPackage);
  }, [annualPackage, selectedPackage]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = useCallback(() => {
    buttonScale.value = withTiming(0.97, { duration: 100 });
  }, [buttonScale]);

  const handleButtonPressOut = useCallback(() => {
    buttonScale.value = withTiming(1, { duration: 100 });
  }, [buttonScale]);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);

  const handleStartTrial = useCallback(async () => {
    if (isProcessing) return;
    triggerSelection();
    setIsProcessing(true);
    try {
      if (variant === 'analytics' && selectedPackage) {
        const success = await purchasePackage(selectedPackage);
        if (success) { triggerSuccess(); onStartTrial(); onClose(); }
      } else {
        const result = onStartTrial();
        if (result instanceof Promise) {
          const success = await result;
          if (success) { triggerSuccess(); onClose(); }
        }
      }
    } catch {
      Alert.alert('Something went wrong', 'Please try again.', [{ text: 'OK' }]);
    } finally {
      setIsProcessing(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
  }, [isProcessing, variant, selectedPackage, purchasePackage, onStartTrial, onClose, triggerSelection, triggerSuccess]);

  const { handleRestorePurchases } = useRestorePurchases({ onClose, onRestorePurchases });

  const priceLabel = selectedPackage
    ? `${selectedPackage.product.priceString}/${String(selectedPackage.packageType) === 'ANNUAL' ? 'year' : 'month'}`
    : priceString ?? undefined;

  return {
    annualPackage,
    buttonAnimatedStyle,
    handleButtonPressIn,
    handleButtonPressOut,
    handleClose,
    handleRestorePurchases,
    handleStartTrial,
    isLoadingOfferings,
    isProcessing,
    monthlyPackage,
    priceLabel,
    selectedPackage,
    setSelectedPackage,
  };
}
