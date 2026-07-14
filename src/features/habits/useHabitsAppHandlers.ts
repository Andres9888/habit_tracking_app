/**
 * useHabitsAppHandlers — manages premium gating, paywall visibility,
 * and the "create habit" flow for the habits screen.
 *
 * Encapsulates all upgrade/paywall state so the component layer stays
 * declarative. Every returned handler is memoised via `useCallback`.
 */

import { useCallback, useState } from 'react';
import { logInteraction } from '../../lib/analytics/interactions';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Dependencies injected by the calling component. */
interface UseHabitsAppHandlersParams {
  /** Opens the "new habit" creation screen. */
  openCreateHabitScreen: () => void;
  /** Haptic: light selection tap. */
  triggerSelection: () => void;
}

/** Values returned by the hook. */
interface UseHabitsAppHandlersResult {
  handleCreateHabitRequest: () => void;
  handlePaywallClose: () => void;
  handlePaywallSuccess: () => void;
  handleUpgradeConfirm: () => void;
  handleUpgradeDismiss: () => void;
  handleUpgradeIntent: () => void;
  paywallVisible: boolean;
  upgradePromptVisible: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHabitsAppHandlers({
  openCreateHabitScreen,
  triggerSelection,
}: UseHabitsAppHandlersParams): UseHabitsAppHandlersResult {
  const [upgradePromptVisible, setUpgradePromptVisible] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);

  /** User tapped the upgrade CTA on the home screen. */
  const handleUpgradeIntent = useCallback(() => {
    logInteraction('premium_home_cta_view', { source: 'home_hero' });
    triggerSelection();
    // Go directly to paywall — skip intermediate prompt to reduce conversion friction
    setPaywallVisible(true);
  }, [triggerSelection]);

  /** Dismiss the upgrade prompt without proceeding. */
  const handleUpgradeDismiss = useCallback(() => {
    setUpgradePromptVisible(false);
  }, []);

  /** User confirmed the upgrade prompt — open the paywall. */
  const handleUpgradeConfirm = useCallback(() => {
    logInteraction('premium_upgrade_cta', { source: 'home_prompt' });
    triggerSelection();
    setUpgradePromptVisible(false);
    setPaywallVisible(true);
  }, [triggerSelection]);

  /** Close the paywall without a purchase. */
  const handlePaywallClose = useCallback(() => {
    setPaywallVisible(false);
  }, []);

  /** Paywall reports a successful purchase. */
  const handlePaywallSuccess = useCallback(() => {
    // RevenueCat's signed, idempotent webhook records purchase_succeeded.
    // Avoid double-counting it from this optimistic client callback.
    setPaywallVisible(false);
  }, []);

  /**
   * Entry point for creating a new habit. The free-tier habit cap was
   * removed in favour of the trial-then-paywall gate at AuthGate, so this
   * always proceeds straight to the creation screen.
   */
  const handleCreateHabitRequest = useCallback(() => {
    openCreateHabitScreen();
  }, [openCreateHabitScreen]);

  return {
    handleCreateHabitRequest,
    handlePaywallClose,
    handlePaywallSuccess,
    handleUpgradeConfirm,
    handleUpgradeDismiss,
    handleUpgradeIntent,
    paywallVisible,
    upgradePromptVisible,
  };
}
