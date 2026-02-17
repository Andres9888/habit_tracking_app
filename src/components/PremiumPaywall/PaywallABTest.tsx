/**
 * PaywallABTest — Paywall A/B Test Orchestrator
 *
 * Reads the `paywall_screen` experiment variant and renders the appropriate paywall:
 *
 *   A (control)  — Existing RevenueCat-managed paywall (no change to conversion baseline)
 *   B (social)   — Social proof paywall: "10,000+ chains built" + user testimonials
 *   C (urgency)  — Fear-of-loss paywall: "Your X-day streak is at risk without Premium"
 *
 * Usage:
 *   Replace `<RevenueCatPaywall ...>` with `<PaywallABTest ...>` in HabitsAppOverlays.
 */

import React, { useEffect } from 'react';
import { RevenueCatPaywall } from '../RevenueCatPaywall';
import { PaywallVariantB } from './PaywallVariantB';
import { PaywallVariantC } from './PaywallVariantC';
import { usePaywallExperiment } from './usePaywallExperiment';

export interface PaywallABTestProps {
  /** Whether the paywall is visible */
  visible: boolean;
  /** Called when user closes without purchasing */
  onClose: () => void;
  /** Called after a successful purchase / trial start */
  onPurchaseSuccess?: () => void;
  /** Called after a successful restore */
  onRestoreSuccess?: () => void;
  /**
   * The user's current streak in days.
   * Used by Variant C to personalise the headline.
   * Defaults to 7 if not provided.
   */
  streakDays?: number;
}

export function PaywallABTest({
  visible,
  onClose,
  onPurchaseSuccess,
  onRestoreSuccess,
  streakDays = 7,
}: PaywallABTestProps) {
  const { variant, ready, trackViewed, trackConverted, trackDismissed } =
    usePaywallExperiment();

  // Track "paywall viewed" the first time the paywall opens after the variant
  // has been resolved. Guard with `ready` to avoid double-fires on remount.
  useEffect(() => {
    if (visible && ready) {
      trackViewed(streakDays);
    }
    // Only fire when visibility toggles to `true`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, ready]);

  const handleClose = () => {
    trackDismissed();
    onClose();
  };

  const handleSuccess = () => {
    trackConverted();
    onPurchaseSuccess?.();
  };

  // ── Variant A — control (RevenueCat native paywall) ────────────────
  if (!ready || variant === 'A') {
    return (
      <RevenueCatPaywall
        visible={visible}
        onClose={handleClose}
        onPurchaseSuccess={handleSuccess}
        onRestoreSuccess={() => {
          trackConverted();
          onRestoreSuccess?.();
        }}
      />
    );
  }

  // ── Variant B — social proof ───────────────────────────────────────
  if (variant === 'B') {
    return (
      <PaywallVariantB
        visible={visible}
        streakDays={streakDays}
        onClose={handleClose}
        onStartTrial={handleSuccess}
        onRestorePurchases={async () => {
          trackConverted();
          onRestoreSuccess?.();
          return true;
        }}
      />
    );
  }

  // ── Variant C — fear-of-loss / streak protection ───────────────────
  return (
    <PaywallVariantC
      visible={visible}
      streakDays={streakDays}
      onClose={handleClose}
      onStartTrial={handleSuccess}
      onRestorePurchases={async () => {
        trackConverted();
        onRestoreSuccess?.();
        return true;
      }}
    />
  );
}
