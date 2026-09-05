/**
 * useRevenueCatPaywall — orchestrates paywall state and actions
 */

import { useCallback, useState, useEffect } from 'react';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { usePressAnimation } from '../../hooks/usePressAnimation';
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
  const {
    animatedStyle: buttonAnimatedStyle,
    pressHandlers: { onPressIn: handlePressIn, onPressOut: handlePressOut },
  } = usePressAnimation();

  useEffect(() => {
    if (!annualPackage && monthlyPackage) setSelectedPlan('monthly');
  }, [annualPackage, monthlyPackage]);

  const selectedPackage = selectedPlan === 'annual' ? annualPackage : monthlyPackage;

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
