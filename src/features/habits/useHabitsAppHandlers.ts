import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { logInteraction } from '../../lib/analytics/interactions';

interface UseHabitsAppHandlersParams {
  openCreateHabitScreen: () => void;
  openTemplatesScreen: () => void;
  isPremiumUser: boolean;
  hasReachedHabitLimit: boolean;
  triggerSelection: () => void;
  triggerWarning: () => void;
}

export function useHabitsAppHandlers({
  openCreateHabitScreen,
  openTemplatesScreen,
  isPremiumUser,
  hasReachedHabitLimit,
  triggerSelection,
  triggerWarning,
}: UseHabitsAppHandlersParams) {
  const [upgradePromptVisible, setUpgradePromptVisible] = useState(false);

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
    openTemplatesScreen();
  }, [openTemplatesScreen, triggerSelection]);

  const handleCreateHabitRequest = useCallback(() => {
    if (!isPremiumUser && hasReachedHabitLimit) {
      triggerWarning();
      Alert.alert(
        '🎉 Great progress!',
        "You've built 3 solid habits! Ready to track more? Upgrade to premium for unlimited habits and advanced insights.",
        [
          { style: 'cancel', text: 'Keep 3 Free' },
          {
            onPress: () => console.log('Navigate to RevenueCat paywall'),
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
    handleUpgradeConfirm,
    handleUpgradeDismiss,
    handleUpgradeIntent,
    upgradePromptVisible,
  };
}
