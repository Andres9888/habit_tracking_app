import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HabitsList } from './components/HabitsList';
import { HabitsModals } from './components/HabitsModals';
import FloatingActionButton from './components/FloatingActionButton';
import WebToaster from './components/WebToaster';
import { useHabitsApp } from './hooks/useHabitsApp';
import RewardCelebrationToast from '../../components/RewardCelebrationToast';
import HabitLimitPaywall from '../../components/HabitLimitPaywall';
import PremiumUpgradeScreen from '../../screens/PremiumUpgradeScreen';
import { logInteraction } from '../../lib/analytics/interactions';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

export function HabitsApp() {
  const { list, modals } = useHabitsApp();
  const { openCreateHabitScreen, openTemplatesScreen } = modals;
  const { dismissRewardToast, rewardToast } = list;
  const autoDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [upgradePromptVisible, setUpgradePromptVisible] = useState(false);
  const [showHabitLimitPaywall, setShowHabitLimitPaywall] = useState(false);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
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
      setShowHabitLimitPaywall(true);
      return;
    }
    
    // Show soft paywall if approaching limit (2/3 habits)
    if (!list.isPremiumUser && list.habits.length >= list.freeHabitLimit - 1) {
      setShowHabitLimitPaywall(true);
      return;
    }
    
    openCreateHabitScreen();
  }, [
    list.hasReachedHabitLimit,
    list.isPremiumUser,
    list.habits.length,
    list.freeHabitLimit,
    openCreateHabitScreen,
    triggerWarning,
  ]);

  const handleUpgradeFromPaywall = useCallback(() => {
    setShowHabitLimitPaywall(false);
    setShowPremiumUpgrade(true);
  }, []);

  const handleStartTrial = useCallback(async () => {
    // TODO: Integrate with RevenueCat/StoreKit
    logInteraction('premium_trial_start', { source: 'upgrade_screen' });
    console.log('Start premium trial - integrate with RevenueCat');
    // For now, just close the modal
    setShowPremiumUpgrade(false);
  }, []);

  const handleRestorePurchases = useCallback(async () => {
    // TODO: Integrate with RevenueCat restore purchases
    logInteraction('premium_restore', { source: 'upgrade_screen' });
    console.log('Restore purchases - integrate with RevenueCat');
  }, []);

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
        
        <HabitLimitPaywall
          currentHabitCount={list.habits.length}
          maxFreeHabits={list.freeHabitLimit}
          type={list.hasReachedHabitLimit ? 'hard' : 'soft'}
          visible={showHabitLimitPaywall}
          onClose={() => setShowHabitLimitPaywall(false)}
          onUpgrade={handleUpgradeFromPaywall}
        />
        
        <PremiumUpgradeScreen
          visible={showPremiumUpgrade}
          onClose={() => setShowPremiumUpgrade(false)}
          onStartTrial={handleStartTrial}
          onRestorePurchases={handleRestorePurchases}
        />
      </View>
    </GestureHandlerRootView>
  );
}

export default HabitsApp;
