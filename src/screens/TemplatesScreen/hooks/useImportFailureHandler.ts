/**
 * Routes a failed template import to the right recovery surface.
 *
 * Hitting the free-habit cap is not a failure the user can retry their way out
 * of — offering "Retry" there is a loop with no exit. Entitlement errors get
 * the paywall (the action that actually unblocks them); everything else keeps
 * the retryable error toast.
 */

import { useCallback } from 'react';
import { logInteraction } from '../../../lib/analytics/interactions';
import { isPremiumRequiredError } from '../../../lib/premium/freeTier';

interface UseImportFailureHandlerOptions {
  onShowPaywall?: (() => void) | undefined;
  showError: (onRetry?: () => void) => void;
}

export type ImportFailureHandler = (error: unknown, retry: () => void) => void;

export function useImportFailureHandler(
  o: UseImportFailureHandlerOptions
): ImportFailureHandler {
  const { onShowPaywall, showError } = o;

  return useCallback(
    (error: unknown, retry: () => void) => {
      if (isPremiumRequiredError(error) && onShowPaywall) {
        logInteraction('premium_upgrade_cta', { source: 'template_import_limit' });
        onShowPaywall();
        return;
      }
      showError(retry);
    },
    [onShowPaywall, showError]
  );
}
