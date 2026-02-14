/**
 * usePaywallTracking Hook
 *
 * Tracks paywall impressions, dismissals, and purchase events.
 * Automatically logs impression when paywall becomes visible.
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import {
  trackPaywallImpression,
  trackPaywallDismissal,
  trackPurchaseStarted,
  trackPurchaseCompleted,
  trackPurchaseCancelled,
  trackPurchaseFailed,
  type PaywallTriggerSource,
} from '../lib/analytics/conversionTracker';
import { getABVariant, getAllAssignments } from '../lib/analytics/abTestFlags';

interface UsePaywallTrackingParams {
  source: PaywallTriggerSource;
  visible: boolean;
  habitCount?: number;
  dayCount?: number;
}

export function usePaywallTracking({
  source,
  visible,
  habitCount,
  dayCount,
}: UsePaywallTrackingParams) {
  const hasTracked = useRef(false);
  const abVariant = useMemo(() => getABVariant('paywall_copy_v1'), []);
  const timingVariant = useMemo(() => getABVariant('paywall_timing'), []);

  useEffect(() => {
    if (visible && !hasTracked.current) {
      hasTracked.current = true;
      trackPaywallImpression({
        abVariant,
        allAssignments: getAllAssignments(),
        dayCount,
        habitCount,
        source,
        timingVariant,
      });
    }
    if (!visible) hasTracked.current = false;
  }, [visible, source, habitCount, dayCount, abVariant, timingVariant]);

  const onDismiss = useCallback(() => trackPaywallDismissal(source), [source]);
  const onPurchaseStart = useCallback(
    (pkg?: string) => trackPurchaseStarted(source, pkg),
    [source]
  );
  const onPurchaseComplete = useCallback(
    (pkg?: string) => trackPurchaseCompleted(source, pkg),
    [source]
  );
  const onPurchaseCancel = useCallback(
    () => trackPurchaseCancelled(source),
    [source]
  );
  const onPurchaseFail = useCallback(
    (err?: string) => trackPurchaseFailed(source, err),
    [source]
  );

  return {
    abVariant,
    onDismiss,
    onPurchaseCancel,
    onPurchaseComplete,
    onPurchaseFail,
    onPurchaseStart,
    timingVariant,
  };
}
