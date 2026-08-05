/**
 * useRevenueCatPaywall — orchestrates paywall state and actions
 */

import { useCallback, useState, useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { usePremium } from '../../hooks/usePremium';
import { computeSavings } from './paywall.constants';
import { usePaywallActions } from './usePaywallActions';
import type { PlanType } from './paywall.types';

interface Params {
  onClose: () => void;
  onPurchaseSuccess: () => void;
  onRestoreSuccess: () => void;
}

export function useRevenueCatPaywall(params: Params) {
  const { triggerSelection } = useHapticFeedback({});
  const { packages, monthlyPackage, isLoadingOfferings, purchasePackage, restorePurchases } = usePremium();
  const actions = usePaywallActions({ ...params, purchasePackage, restorePurchases });

  const annualPackage = packages?.find((p) => p.packageType === 'ANNUAL') ?? null;
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    if (!annualPackage && monthlyPackage) setSelectedPlan('monthly');
  }, [annualPackage, monthlyPackage]);

  const selectedPackage = selectedPlan === 'annual' ? annualPackage : monthlyPackage;

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = useCallback(() => {
    buttonScale.value = withTiming(0.97, { duration: 100 });
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    buttonScale.value = withTiming(1, { duration: 100 });
  }, [buttonScale]);

  const handleSelectPlan = useCallback(
    (plan: PlanType) => {
      triggerSelection();
      setSelectedPlan(plan);
    },
    [triggerSelection],
  );

  const handlePurchase = useCallback(
    () => actions.handlePurchase(selectedPackage),
    [actions, selectedPackage],
  );

  return {
    annualPackage,
    buttonAnimatedStyle,
    handleClose: actions.handleClose,
    handlePressIn,
    handlePressOut,
    handlePurchase,
    handleRestore: actions.handleRestore,
    handleSelectPlan,
    isLoadingOfferings,
    isProcessing: actions.isProcessing,
    monthlyPackage,
    savingsPercent: computeSavings(monthlyPackage, annualPackage),
    selectedPackage,
    selectedPlan,
  };
}
