import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { logInteraction } from '../../lib/analytics/interactions';

interface UseHabitsAppHandlersParams {
  openCreateHabitScreen: () => void;
  isPremiumUser: boolean;
  hasReachedHabitLimit: boolean;
  triggerSelection: () => void;
  triggerWarning: () => void;
}

export function useHabitsAppHandlers({
  openCreateHabitScreen,
  isPremiumUser,
  hasReachedHabitLimit,
  triggerSelection,
  triggerWarning,
}: UseHabitsAppHandlersParams) {
  const [upgradePromptVisible, setUpgradePromptVisible] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);

  const handleUpgradeIntent = useCallback(() => {
    logInteraction('premium_home_cta_view', { source: 'home_hero' });
    triggerSelection();
    setUpgradePromptVisible(true);
  }, [triggerSelection]);

  const handleUpgradeDismiss = useCallback(() => {
    setUpgradePromptVisible(false);
  }, []);

  const handleUpgradeConfirm = useCallback(() => {
    logInteraction('premium_upgrade_cta', { source: 'home_prompt' });
    triggerSelection();
    setUpgradePromptVisible(false);
    setPaywallVisible(true);
  }, [triggerSelection]);

  const handlePaywallClose = useCallback(() => {
    setPaywallVisible(false);
  }, []);

  const handlePaywallSuccess = useCallback(() => {
    logInteraction('premium_purchase_success', { source: 'home_prompt' });
    setPaywallVisible(false);
  }, []);

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
