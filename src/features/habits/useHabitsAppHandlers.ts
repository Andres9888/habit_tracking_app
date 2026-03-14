/**
 * useHabitsAppHandlers — manages premium gating and the "create habit" flow.
 *
 * Uses RevenueCat's native paywall UI via useNativePaywall.
 * Every returned handler is memoised via `useCallback`.
 */

import { useCallback, useState } from 'react';
import { useNativePaywall } from '../../hooks/useNativePaywall';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UseHabitsAppHandlersParams {
  openCreateHabitScreen: () => void;
  isPremiumUser: boolean;
  hasReachedHabitLimit: boolean;
  triggerSelection: () => void;
  triggerWarning: () => void;
}

interface UseHabitsAppHandlersResult {
  dismissWebFallback: () => void;
  handleCreateHabitRequest: () => void;
  handleUpgradeConfirm: () => void;
  handleUpgradeDismiss: () => void;
  handleUpgradeIntent: () => void;
  upgradePromptVisible: boolean;
  webFallbackVisible: boolean;
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
  const { presentPaywall, webFallbackVisible, dismissWebFallback } =
    useNativePaywall();

  const handleUpgradeIntent = useCallback(() => {
    triggerSelection();
    void presentPaywall({ source: 'home_hero' });
  }, [triggerSelection, presentPaywall]);

  const handleUpgradeDismiss = useCallback(() => {
    setUpgradePromptVisible(false);
  }, []);

  const handleUpgradeConfirm = useCallback(() => {
    triggerSelection();
    setUpgradePromptVisible(false);
    void presentPaywall({ source: 'home_prompt' });
  }, [triggerSelection, presentPaywall]);

  const handleCreateHabitRequest = useCallback(() => {
    if (!isPremiumUser && hasReachedHabitLimit) {
      triggerWarning();
      void presentPaywall({
        source: 'habit_limit',
        onSuccess: openCreateHabitScreen,
      });
      return;
    }
    openCreateHabitScreen();
  }, [
    hasReachedHabitLimit,
    isPremiumUser,
    openCreateHabitScreen,
    presentPaywall,
    triggerWarning,
  ]);

  return {
    dismissWebFallback,
    handleCreateHabitRequest,
    handleUpgradeConfirm,
    handleUpgradeDismiss,
    handleUpgradeIntent,
    upgradePromptVisible,
    webFallbackVisible,
  };
}
