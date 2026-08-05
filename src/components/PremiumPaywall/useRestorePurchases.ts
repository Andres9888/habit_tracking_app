/**
 * Restore purchases handler extracted from usePremiumPaywall
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { usePremium } from '../../hooks/usePremium';

interface UseRestoreParams {
  onClose: () => void;
  onRestorePurchases?: () => Promise<boolean>;
}

export function useRestorePurchases({ onClose, onRestorePurchases }: UseRestoreParams) {
  const { triggerLightImpact, triggerSuccess, triggerError } = useHapticFeedback({});
  const { restorePurchases: defaultRestore } = usePremium();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestorePurchases = useCallback(async () => {
    if (isRestoring) return;

    triggerLightImpact();
    setIsRestoring(true);
    const restoreFn = onRestorePurchases ?? defaultRestore;

    try {
      const success = await restoreFn();
      if (success) {
        triggerSuccess();
        Alert.alert('✓ Purchases Restored', 'Your premium subscription has been restored!', [
          { onPress: () => onClose(), text: 'Great!' },
        ]);
      } else {
        Alert.alert('No Purchases Found', "We couldn't find any previous purchases.", [
          { text: 'OK' },
        ]);
      }
    } catch {
      triggerError?.();
      Alert.alert('Restore Failed', 'Please try again or contact support.', [{ text: 'OK' }]);
    } finally {
      setIsRestoring(false);
    }
  }, [isRestoring, onRestorePurchases, defaultRestore, onClose, triggerLightImpact, triggerSuccess, triggerError]);

  return { handleRestorePurchases, isRestoring };
}
