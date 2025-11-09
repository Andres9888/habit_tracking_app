import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HabitsList } from './components/HabitsList';
import { HabitsModals } from './components/HabitsModals';
import FloatingActionButton from './components/FloatingActionButton';
import WebToaster from './components/WebToaster';
import { useHabitsApp } from './hooks/useHabitsApp';
import RewardCelebrationToast from '../../components/RewardCelebrationToast';
import { logInteraction } from '../../lib/analytics/interactions';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

export function HabitsApp() {
  const { list, modals } = useHabitsApp();
  const { openCreateHabitScreen, openTemplatesScreen } = modals;
  const { dismissRewardToast, rewardToast } = list;
  const autoDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [upgradePromptVisible, setUpgradePromptVisible] = useState(false);
  const { triggerSelection, triggerWarning } = useHapticFeedback({
    isEnabled: list.celebrationsEnabled,
    preference: list.reduceMotionPreference,
  });

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
    // Check if user has reached the free limit (3 habits)
    if (!list.isPremiumUser && list.hasReachedHabitLimit) {
      triggerWarning();

      // TODO: Integrate RevenueCat for subscription management
      // Show toast notification for 4th habit creation attempt
      Alert.alert(
        'Upgrade to Premium',
        'You\'ve reached the free limit of 3 habits. Upgrade to premium to track unlimited habits!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade', onPress: () => {
            // TODO: Navigate to RevenueCat paywall
            console.log('Navigate to RevenueCat paywall');
          }}
        ]
      );
      return;
    }
    openCreateHabitScreen();
  }, [
    list.hasReachedHabitLimit,
    list.isPremiumUser,
    openCreateHabitScreen,
    triggerWarning,
  ]);

  useEffect(() => {
    if (!rewardToast) {
      return;
    }

    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
    }

    autoDismissTimer.current = setTimeout(() => {
      dismissRewardToast();
    }, 5200);

    return () => {
      if (autoDismissTimer.current) {
        clearTimeout(autoDismissTimer.current);
      }
    };
  }, [dismissRewardToast, rewardToast]);

  const handleShareStreak = useCallback(() => {
    if (!rewardToast) {
      return;
    }

    logInteraction('reward_share_tap', {
      habitId: rewardToast.habitId,
      habitName: rewardToast.habitName,
      streak: rewardToast.streak,
    });
    dismissRewardToast();
  }, [dismissRewardToast, rewardToast]);

  const handleUnlockBoosters = useCallback(() => {
    if (!rewardToast) {
      return;
    }

    logInteraction('premium_upsell_tap', {
      habitId: rewardToast.habitId,
      habitName: rewardToast.habitName,
      streak: rewardToast.streak,
    });
    dismissRewardToast();
    openTemplatesScreen();
  }, [dismissRewardToast, openTemplatesScreen, rewardToast]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className='flex-1 bg-[#f3f4f6]'>
        <View className='pointer-events-none absolute inset-0 bg-[#f3f4f6]' />
        <View className='pointer-events-none absolute inset-x-0 top-0 h-56 rounded-b-[40px] bg-white shadow-[0px_24px_48px_rgba(15,23,42,0.08)]' />
        <HabitsList
          list={list}
          modals={modals}
          canNavigateForward={list.canNavigateForward}
          onCreateHabitRequest={handleCreateHabitRequest}
          onUpgradeConfirm={handleUpgradeConfirm}
          onUpgradeDismiss={handleUpgradeDismiss}
          onUpgradeIntent={handleUpgradeIntent}
          upgradePromptVisible={upgradePromptVisible}
          weekDates={list.weekDates}
          onNextWeek={list.handleNextWeek}
          onPreviousWeek={list.handlePreviousWeek}
        />

        <View className='absolute bottom-8 right-6'>
          <FloatingActionButton
            celebrationsEnabled={list.celebrationsEnabled}
            openCreateHabitScreen={handleCreateHabitRequest}
            reduceMotionPreference={list.reduceMotionPreference}
          />
        </View>

        <WebToaster />
        <HabitsModals state={modals} />
        <RewardCelebrationToast
          message={rewardToast?.message ?? ''}
          onDismiss={dismissRewardToast}
          onPrimaryAction={handleUnlockBoosters}
          onSecondaryAction={handleShareStreak}
          streak={rewardToast?.streak}
          visible={Boolean(rewardToast)}
        />
      </View>
    </GestureHandlerRootView>
  );
}

export default HabitsApp;
