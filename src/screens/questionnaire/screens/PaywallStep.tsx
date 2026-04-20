import { useAuth } from '@clerk/clerk-expo';
import { useCallback } from 'react';

import { RevenueCatPaywall } from '@/components/RevenueCatPaywall/RevenueCatPaywall';

import type { StepProps } from '../QuestionnaireFlow.types';
import { useTemplateAutoImport } from '../useTemplateAutoImport';

export function PaywallStep({
  selectedTemplateIds,
  onNext,
}: StepProps) {
  const { isSignedIn } = useAuth();
  useTemplateAutoImport(selectedTemplateIds, isSignedIn ?? false);

  const handleClose = useCallback(() => {
    onNext();
  }, [onNext]);

  const handlePurchaseSuccess = useCallback(() => {
    onNext();
  }, [onNext]);

  return (
    <RevenueCatPaywall
      visible
      onClose={handleClose}
      onPurchaseSuccess={handlePurchaseSuccess}
      onRestoreSuccess={handlePurchaseSuccess}
    />
  );
}
