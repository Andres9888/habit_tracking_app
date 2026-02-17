/**
 * usePaywallExperiment
 *
 * Resolves the paywall A/B test variant and exposes tracking helpers.
 *
 * Variants:
 *   A — control: existing RevenueCat-managed paywall (no change)
 *   B — social proof: "10,000+ chains built" + user testimonials
 *   C — fear-of-loss: "Your X-day streak is at risk without Premium"
 *
 * Uses the A/B framework from PR #981 (src/lib/abTest.ts).
 */

import { useEffect, useState } from 'react';

import { getVariant, trackEvent, type VariantId } from '@/lib/abTest';

export const PAYWALL_EXPERIMENT_ID = 'paywall_screen';

export type PaywallABVariant = 'A' | 'B' | 'C';

export interface PaywallExperiment {
  /** True once the variant has been resolved from AsyncStorage */
  ready: boolean;
  /** The assigned variant ('A' | 'B' | 'C') */
  variant: PaywallABVariant;
  /** Track that the paywall was shown */
  trackViewed: (streakDays?: number) => void;
  /** Track a successful conversion (purchase/trial started) */
  trackConverted: () => void;
  /** Track that the user dismissed the paywall */
  trackDismissed: () => void;
}

export function usePaywallExperiment(): PaywallExperiment {
  const [variant, setVariant] = useState<PaywallABVariant>('A');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getVariant(PAYWALL_EXPERIMENT_ID).then((v) => {
      if (!cancelled) {
        setVariant(v as PaywallABVariant);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const trackViewed = (streakDays?: number) => {
    trackEvent('paywall_viewed', PAYWALL_EXPERIMENT_ID, variant, {
      streak_days: streakDays,
    });
  };

  const trackConverted = () => {
    trackEvent('paywall_converted', PAYWALL_EXPERIMENT_ID, variant);
  };

  const trackDismissed = () => {
    trackEvent('paywall_dismissed', PAYWALL_EXPERIMENT_ID, variant);
  };

  return { ready, trackConverted, trackDismissed, trackViewed, variant };
}

/**
 * Narrow a raw VariantId to a typed PaywallABVariant.
 * Falls back to 'A' for any unrecognised value.
 */
export function toPaywallABVariant(id: VariantId): PaywallABVariant {
  if (id === 'B' || id === 'C') return id;
  return 'A';
}
