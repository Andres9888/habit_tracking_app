import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HabitsList } from './components/HabitsList';
import { HabitsModals } from './components/HabitsModals';
import FloatingActionButton from './components/FloatingActionButton';
import WebToaster from './components/WebToaster';
import { useHabitsApp } from './hooks/useHabitsApp';
import RewardCelebrationToast from '../../components/RewardCelebrationToast';
import { logInteraction } from '../../lib/analytics/interactions';

export function HabitsApp() {
  const { list, modals } = useHabitsApp();
  const { openCreateHabitScreen, openSettings, openTemplatesScreen } = modals;
  const { dismissRewardToast, rewardToast } = list;
  const autoDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      <View className='flex-1 bg-[#f8f5f1]'>
        <HabitsList
          list={list}
          modals={modals}
          canNavigateForward={list.canNavigateForward}
          weekDates={list.weekDates}
          onNextWeek={list.handleNextWeek}
          onPreviousWeek={list.handlePreviousWeek}
        />

        <View className='absolute bottom-8 right-6'>
          <FloatingActionButton
            celebrationsEnabled={list.celebrationsEnabled}
            openCreateHabitScreen={openCreateHabitScreen}
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
