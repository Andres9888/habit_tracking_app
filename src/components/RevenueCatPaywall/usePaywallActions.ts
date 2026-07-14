/**
 * usePaywallActions — purchase and restore handlers
 */

import { useCallback, useRef, useState } from 'react';
import type { PurchasesPackage } from 'react-native-purchases';
import { logInteraction } from '../../lib/analytics/interactions';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import {
  showNoPurchasesFound,
  showPurchaseFailure,
  showRestoreFailure,
  showRestoreSuccess,
} from './paywallAlerts';

interface Params {
  onClose: () => void;
  onPurchaseSuccess: () => void;
  onRestoreSuccess: () => void;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

export function usePaywallActions({
  onClose,
  onPurchaseSuccess,
  onRestoreSuccess,
  purchasePackage,
  restorePurchases,
}: Params) {
  const { triggerSelection, triggerLightImpact, triggerSuccess, triggerError } =
    useHapticFeedback({});
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const handlePurchase = useCallback(
    async (selectedPackage: PurchasesPackage | null) => {
      if (processingRef.current || !selectedPackage) return;
      processingRef.current = true;
      triggerSelection();
      setIsProcessing(true);
      try {
        logInteraction('checkout_started', { source: 'paywall' });
        const success = await purchasePackage(selectedPackage);
        if (success) {
          triggerSuccess();
          onPurchaseSuccess();
          onClose();
        }
      } catch {
        triggerError?.();
        showPurchaseFailure();
      } finally {
        processingRef.current = false;
        setIsProcessing(false);
      }
    },
    [
      purchasePackage,
      onPurchaseSuccess,
      onClose,
      triggerSelection,
      triggerSuccess,
      triggerError,
    ]
  );

  const handleRestore = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    triggerLightImpact();
    setIsProcessing(true);
    try {
      const success = await restorePurchases();
      if (success) {
        triggerSuccess();
        showRestoreSuccess(() => {
          onRestoreSuccess();
          onClose();
        });
      } else {
        showNoPurchasesFound();
      }
    } catch {
      triggerError?.();
      showRestoreFailure();
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [
    restorePurchases,
    onRestoreSuccess,
    onClose,
    triggerLightImpact,
    triggerSuccess,
    triggerError,
  ]);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);

  return { handleClose, handlePurchase, handleRestore, isProcessing };
}
