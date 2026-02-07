/**
 * PremiumBenefitsModal Handlers
 * Button press and restore purchases logic
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { usePremium } from '../../../../hooks/usePremium';

export function usePremiumModalHandlers(
  onClose: () => void,
  onStartTrial: () => void
) {
  const { triggerSelection, triggerLightImpact, triggerSuccess, triggerError } =
    useHapticFeedback({});
  const { priceString, isLoadingOfferings, restorePurchases } = usePremium();
  const buttonScale = useSharedValue(1);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);

  const handleStartTrial = useCallback(() => {
    triggerSelection();
    onStartTrial();
  }, [onStartTrial, triggerSelection]);

  const handleRestorePurchases = useCallback(async () => {
    triggerLightImpact();
    setIsRestoring(true);

    try {
      const success = await restorePurchases();

      if (success) {
        triggerSuccess();
        Alert.alert(
          '\u2713 Purchases Restored',
          'Your premium subscription has been successfully restored!',
          [{ onPress: () => onClose(), text: 'Great!' }]
        );
      } else {
        triggerLightImpact();
        Alert.alert(
          'No Purchases Found',
          "We couldn't find any previous purchases for this account. If you believe this is an error, please contact support.",
          [{ text: 'OK' }]
        );
      }
    } catch (error_) {
      triggerError();
      console.error('[PremiumBenefitsModal] Restore error:', error_);
      Alert.alert(
        'Restore Failed',
        'There was a problem restoring your purchases. Please try again or contact support if the issue persists.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRestoring(false);
    }
  }, [
    triggerLightImpact,
    triggerSuccess,
    triggerError,
    restorePurchases,
    onClose,
  ]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = useCallback(() => {
    buttonScale.value = withTiming(0.97, { duration: 100 });
  }, [buttonScale]);

  const handleButtonPressOut = useCallback(() => {
    buttonScale.value = withTiming(1, { duration: 100 });
  }, [buttonScale]);

  return {
    buttonAnimatedStyle,
    handleButtonPressIn,
    handleButtonPressOut,
    handleClose,
    handleRestorePurchases,
    handleStartTrial,
    isLoadingOfferings,
    isRestoring,
    priceString,
  };
}
