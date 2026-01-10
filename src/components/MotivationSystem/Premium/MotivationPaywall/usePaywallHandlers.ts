/**
 * Event handlers for MotivationPaywall
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';

interface UsePaywallHandlersParams {
  onClose: () => void;
  onStartTrial: () => Promise<boolean>;
  onRestorePurchases?: () => Promise<boolean>;
}

export function usePaywallHandlers({
  onClose,
  onStartTrial,
  onRestorePurchases,
}: UsePaywallHandlersParams) {
  const { triggerSelection, triggerLightImpact, triggerSuccess } =
    useHapticFeedback({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);

  const handleStartTrial = useCallback(async () => {
    if (isProcessing) return;

    triggerSelection();
    setIsProcessing(true);

    try {
      const success = await onStartTrial();
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
  }, [isProcessing, onStartTrial, onClose, triggerSelection, triggerSuccess]);

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
          "We couldn't find any previous purchases. Start a new subscription to unlock premium features.",
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
    handleStartTrial,
    isProcessing,
  };
}
