/**
 * useHabitsAppHandlers — manages premium gating, paywall visibility,
 * and the "create habit" flow for the habits screen.
 *
 * Encapsulates all upgrade/paywall state so the component layer stays
 * declarative. Every returned handler is memoised via `useCallback`.
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { logInteraction } from '../../lib/analytics/interactions';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Dependencies injected by the calling component. */
interface UseHabitsAppHandlersParams {
  /** Opens the "new habit" creation screen. */
  openCreateHabitScreen: () => void;
  /** Whether the current user has an active premium subscription. */
  isPremiumUser: boolean;
  /** Whether the free-tier habit limit has been reached. */
  hasReachedHabitLimit: boolean;
  /** Haptic: light selection tap. */
  triggerSelection: () => void;
  /** Haptic: warning bump (e.g. limit reached). */
  triggerWarning: () => void;
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
  isPremiumUser,
  hasReachedHabitLimit,
  triggerSelection,
  triggerWarning,
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
    logInteraction('premium_purchase_success', { source: 'home_prompt' });
    setPaywallVisible(false);
  }, []);

  /**
   * Gate-checked entry point for creating a new habit.
   *
   * If the user is on the free tier and has hit the limit, shows an alert
   * with an upsell; otherwise opens the creation screen directly.
   */
  const handleCreateHabitRequest = useCallback(() => {
    if (!isPremiumUser && hasReachedHabitLimit) {
      triggerWarning();
      Alert.alert(
        '🎉 Great progress!',
        "You've built 3 solid habits! Ready to track more? Upgrade to premium for unlimited habits and advanced insights.",
        [
          { style: 'cancel', text: 'Keep 3 Free' },
          {
            onPress: () => setPaywallVisible(true),
            text: 'Unlock Unlimited',
          },
        ]
      );
      return;
    }
    openCreateHabitScreen();
  }, [
    hasReachedHabitLimit,
    isPremiumUser,
    openCreateHabitScreen,
    triggerWarning,
  ]);

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
