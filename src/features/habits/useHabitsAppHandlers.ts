/**
 * useHabitsAppHandlers — premium gating, paywall visibility,
 * and the "create habit" flow for the habits screen.
 */

import { useCallback, useRef, useState } from 'react';
import { logInteraction } from '../../lib/analytics/interactions';
import type {
  UseHabitsAppHandlersParams,
  UseHabitsAppHandlersResult,
} from './useHabitsAppHandlers.types';

export function useHabitsAppHandlers({
  hasReachedHabitLimit,
  isPremiumUser,
  openCreateHabitScreen,
  triggerSelection,
}: UseHabitsAppHandlersParams): UseHabitsAppHandlersResult {
  const [upgradePromptVisible, setUpgradePromptVisible] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const paywallSourceRef = useRef<'upgrade' | 'habit_limit'>('upgrade');

  const handleUpgradeIntent = useCallback(() => {
    logInteraction('premium_home_cta_view', { source: 'home_hero' });
    triggerSelection();
    paywallSourceRef.current = 'upgrade';
    setPaywallVisible(true);
  }, [triggerSelection]);

  const handleUpgradeDismiss = useCallback(() => {
    setUpgradePromptVisible(false);
  }, []);

  const handleUpgradeConfirm = useCallback(() => {
    logInteraction('premium_upgrade_cta', { source: 'home_prompt' });
    triggerSelection();
    setUpgradePromptVisible(false);
    paywallSourceRef.current = 'upgrade';
    setPaywallVisible(true);
  }, [triggerSelection]);

  const handlePaywallClose = useCallback(() => {
    setPaywallVisible(false);
  }, []);

  const handlePaywallSuccess = useCallback(() => {
    const source = paywallSourceRef.current;
    logInteraction('premium_purchase_success', {
      source: source === 'habit_limit' ? 'habit_limit' : 'home_prompt',
    });
    setPaywallVisible(false);
    if (source === 'habit_limit') {
      openCreateHabitScreen();
    }
  }, [openCreateHabitScreen]);

  const handleCreateHabitRequest = useCallback(() => {
    if (!isPremiumUser && hasReachedHabitLimit) {
      logInteraction('premium_habit_limit_reached', { habitCount: 3 });
      paywallSourceRef.current = 'habit_limit';
      setPaywallVisible(true);
      return;
    }
    openCreateHabitScreen();
  }, [hasReachedHabitLimit, isPremiumUser, openCreateHabitScreen]);

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
