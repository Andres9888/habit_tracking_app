/**
 * useNativePaywall — presents RevenueCat's native paywall UI.
 * Falls back to a web modal on unsupported platforms.
 */

import { useCallback, useState } from 'react';
import { useHapticFeedback } from '../useHapticFeedback';
import { logInteraction } from '../../lib/analytics/interactions';
import { presentNativePaywall } from './presentNativePaywall';
import type { PresentPaywallOptions, PaywallOutcome, UseNativePaywallReturn } from './types';

export function useNativePaywall(): UseNativePaywallReturn {
  const [webFallbackVisible, setWebFallbackVisible] = useState(false);
  const { triggerSuccess } = useHapticFeedback({});

  const presentPaywall = useCallback(
    async (options: PresentPaywallOptions): Promise<PaywallOutcome> => {
      logInteraction('paywall_presented', { source: options.source });

      const outcome = await presentNativePaywall();

      // null means native SDK unavailable (web / Expo Go)
      if (outcome === null) {
        setWebFallbackVisible(true);
        return 'cancelled';
      }

      if (outcome === 'purchased' || outcome === 'restored') {
        triggerSuccess();
        logInteraction('paywall_success', {
          outcome,
          source: options.source,
        });
        options.onSuccess?.();
      }

      return outcome;
    },
    [triggerSuccess]
  );

  const dismissWebFallback = useCallback(() => {
    setWebFallbackVisible(false);
  }, []);

  return { dismissWebFallback, presentPaywall, webFallbackVisible };
}
