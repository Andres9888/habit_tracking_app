/**
 * usePremiumPaywall Hook
 *
 * Unified purchase/restore logic for all paywall variants.
 */

import { useCallback, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { type AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { usePremium } from '../../hooks/usePremium';
import { useRestorePurchases } from './useRestorePurchases';
import type { PaywallVariant } from './PremiumPaywall.types';
import type { PurchasesPackage } from 'react-native-purchases';

interface Params {
  variant: PaywallVariant;
  onClose: () => void;
  onStartTrial: () => void | Promise<boolean>;
  onRestorePurchases?: () => Promise<boolean>;
}

export interface PremiumPaywallHandlers {
  annualPackage: PurchasesPackage | null;
  buttonAnimatedStyle: AnimatedStyle<ViewStyle>;
  handleButtonPressIn: () => void;
  handleButtonPressOut: () => void;
  handleClose: () => void;
  handleRestorePurchases: () => Promise<void>;
  handleStartTrial: () => Promise<void>;
  isLoadingOfferings: boolean;
  isProcessing: boolean;
  monthlyPackage: PurchasesPackage | null;
  priceLabel: string | undefined;
  selectedPackage: PurchasesPackage | null;
  setSelectedPackage: (pkg: PurchasesPackage | null) => void;
}

export function usePremiumPaywall({ variant, onClose, onStartTrial, onRestorePurchases }: Params) {
  const { triggerSelection, triggerLightImpact, triggerSuccess } = useHapticFeedback({});
  const { monthlyPackage, packages, priceString, isLoadingOfferings, purchasePackage } =
    usePremium();

  const annualPackage = packages?.find((p) => p.packageType === 'ANNUAL') ?? null;
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    animatedStyle: buttonAnimatedStyle,
    pressHandlers: {
      onPressIn: handleButtonPressIn,
      onPressOut: handleButtonPressOut,
    },
  } = usePressAnimation();

  useEffect(() => {
    if (!selectedPackage && annualPackage) setSelectedPackage(annualPackage);
  }, [annualPackage, selectedPackage]);

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
      Alert.alert(
        'Premium Activation Failed',
        'We couldn\u2019t activate your premium subscription. Please check your payment method and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
     
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
