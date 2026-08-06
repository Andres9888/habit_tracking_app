/**
 * useHabitsAppHandlers — manages premium gating, paywall visibility,
 * and the "create habit" flow for the habits screen.
 *
 * Encapsulates all upgrade/paywall state so the component layer stays
 * declarative. Every returned handler is memoised via `useCallback`.
 */

import { useCallback, useState } from 'react';
import { logInteraction } from '../../lib/analytics/interactions';
import { canAddHabit } from '../../lib/premium/freeTier';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Dependencies injected by the calling component. */
interface UseHabitsAppHandlersParams {
  /** The user's habits — used to evaluate the free-tier cap. */
  habits: readonly { archived?: boolean | undefined; paused?: boolean | undefined }[];
  /** Whether the user currently holds a premium entitlement. */
  isPremiumUser: boolean;
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
  habits,
  isPremiumUser,
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
    logInteraction('premium_purchase_success', { source: 'home_prompt' });
    setPaywallVisible(false);
  }, []);

  /**
   * Entry point for creating a new habit.
   *
   * A free user at the cap meets the paywall here rather than at the mutation.
   * The server enforces the same limit, but letting the request travel that far
   * means the user fills in a whole habit and then loses it to an error — the
   * offer has to arrive before the work, not after it.
   */
  const handleCreateHabitRequest = useCallback(() => {
    if (!canAddHabit(isPremiumUser, habits)) {
      logInteraction('premium_upgrade_cta', { source: 'habit_limit' });
      triggerSelection();
      setPaywallVisible(true);
      return;
    }
    openCreateHabitScreen();
  }, [habits, isPremiumUser, openCreateHabitScreen, triggerSelection]);

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
