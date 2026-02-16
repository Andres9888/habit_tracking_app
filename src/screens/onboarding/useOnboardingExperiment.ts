/**
 * Hook to resolve the onboarding A/B test variant.
 *
 * Variant A — full 3-screen onboarding (control)
 * Variant B — shortened 2-screen onboarding (chain + templates, skip strength)
 */

import { useEffect, useState } from 'react';

import {
  getVariant,
  trackEvent,
  type VariantId,
} from '@/lib/abTest';

const EXPERIMENT_ID = 'onboarding_flow';

export interface OnboardingExperiment {
  /** True once the variant has been resolved from AsyncStorage */
  ready: boolean;
  /** The assigned variant ('A' | 'B') */
  variant: VariantId;
  /** Track onboarding completion for this experiment */
  trackCompleted: () => void;
}

export function useOnboardingExperiment(): OnboardingExperiment {
  const [variant, setVariant] = useState<VariantId>('A');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getVariant(EXPERIMENT_ID).then((v) => {
      if (!cancelled) {
        setVariant(v);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const trackCompleted = () => {
    trackEvent('onboarding_completed', EXPERIMENT_ID, variant);
  };

  return { ready, trackCompleted, variant };
}
