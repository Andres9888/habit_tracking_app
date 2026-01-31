/**
 * useRestorePurchases Hook
 *
 * Handles the restore purchases flow with loading state and alerts.
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { usePremium } from '../../../../hooks/usePremium';

export function useRestorePurchases(onSuccess: () => void) {
  const { triggerLightImpact, triggerSuccess } = useHapticFeedback({});
  const { restorePurchases } = usePremium();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = useCallback(async () => {
    triggerLightImpact();
    setIsRestoring(true);

    try {
      const success = await restorePurchases();
      if (success) {
        triggerSuccess();
        Alert.alert('Restored!', 'Your purchases have been restored.', [
          { onPress: onSuccess, text: 'OK' },
        ]);
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases were found.');
      }
    } catch {
      Alert.alert('Restore Failed', 'Unable to restore. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  }, [triggerLightImpact, restorePurchases, triggerSuccess, onSuccess]);

  return { handleRestore, isRestoring };
}

export default useRestorePurchases;
