/**
 * Event handlers for MotivationPaywall
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import type { PlanType } from './types';

interface UsePaywallHandlersParams {
  onClose: () => void;
  onRestorePurchases?: () => Promise<boolean>;
  onStartTrial: (plan: PlanType) => Promise<boolean>;
}

export function usePaywallHandlers({
  onClose,
  onStartTrial,
  onRestorePurchases,
}: UsePaywallHandlersParams) {
  const { triggerLightImpact, triggerSelection, triggerSuccess } =
    useHapticFeedback({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);
  const handleSelectPlan = useCallback(
    (plan: PlanType) => {
      triggerLightImpact();
      setSelectedPlan(plan);
    },
    [triggerLightImpact]
  );

  const handleStartTrial = useCallback(async () => {
    if (isProcessing) return;
    triggerSelection();
    setIsProcessing(true);
    try {
      const success = await onStartTrial(selectedPlan);
      if (success) {
        triggerSuccess();
        onClose();
      }
    } catch {
      Alert.alert(
        'Something went wrong',
        'Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing,
    onStartTrial,
    selectedPlan,
    onClose,
    triggerSelection,
    triggerSuccess,
  ]);

  const handleRestorePurchases = useCallback(async () => {
    if (isProcessing || !onRestorePurchases) return;
    triggerLightImpact();
    setIsProcessing(true);
    try {
      const success = await onRestorePurchases();
      if (success) {
        triggerSuccess();
        onClose();
      } else {
        Alert.alert(
          'No purchases found',
          "We couldn't find any previous purchases.",
          [{ text: 'OK' }]
        );
      }
    } catch {
      Alert.alert('Restore failed', 'Please try again or contact support.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing,
    onRestorePurchases,
    onClose,
    triggerLightImpact,
    triggerSuccess,
  ]);

  return {
    handleClose,
    handleRestorePurchases,
    handleSelectPlan,
    handleStartTrial,
    isProcessing,
    selectedPlan,
  };
}
