/**
 * Custom hook for restore purchases functionality
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { usePremium } from '../../../../hooks/usePremium';

interface UseRestorePurchasesOptions {
  onSuccess?: () => void;
}

export function useRestorePurchases(options: UseRestorePurchasesOptions = {}) {
  const { triggerLightImpact, triggerSuccess, triggerError } =
    useHapticFeedback({});
  const { restorePurchases } = usePremium();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = useCallback(async () => {
    if (isRestoring) return;

    triggerLightImpact();
    setIsRestoring(true);

    try {
      const success = await restorePurchases();
      if (success) {
        triggerSuccess();
        Alert.alert(
          'Purchases Restored',
          'Your premium subscription has been restored!',
          [{ onPress: options.onSuccess, text: 'OK' }]
        );
      } else {
        triggerError();
        Alert.alert(
          'No Purchases Found',
          "We couldn't find any previous purchases associated with your account.",
          [{ text: 'OK' }]
        );
      }
    } catch {
      triggerError();
      Alert.alert(
        'Restore Failed',
        'Something went wrong while restoring purchases. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRestoring(false);
    }
  }, [
    isRestoring,
    triggerLightImpact,
    restorePurchases,
    triggerSuccess,
    triggerError,
    options.onSuccess,
  ]);

  return { handleRestore, isRestoring };
}
