/** useRestorePurchases — restore prior IAP entitlements via the RevenueCat SDK */
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { Purchases } from '@/lib/purchases/Purchases';

export function useRestorePurchases() {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = useCallback(() => {
    if (isRestoring) return;
    setIsRestoring(true);
    void (async () => {
      try {
        await Purchases.restorePurchases();
        Alert.alert('Restore Purchases', 'Your purchases have been restored.');
      } catch {
        Alert.alert(
          'Restore Purchases',
          'Nothing to restore, or restore is unavailable right now.'
        );
      } finally {
        setIsRestoring(false);
      }
    })();
  }, [isRestoring]);

  return { isRestoring, handleRestore };
}
