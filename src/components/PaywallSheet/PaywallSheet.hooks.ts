/**
 * Business logic for PaywallSheet
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export function usePaywallSheet(
  onClose: () => void,
  onPurchaseSuccess?: () => void
) {
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = useCallback(async () => {
    try {
      setIsPurchasing(true);
      // RevenueCat purchase integration:
      // const packages = await Purchases.getOfferings();
      // const pkg = packages.current?.availablePackages[0];
      // if (pkg) await Purchases.purchasePackage(pkg);
      onPurchaseSuccess?.();
      onClose();
    } catch (error: any) {
      if (!error?.userCancelled) {
        Alert.alert('Purchase Failed', 'Please try again later.');
      }
    } finally {
      setIsPurchasing(false);
    }
  }, [onClose, onPurchaseSuccess]);

  return { handlePurchase, isPurchasing };
}
