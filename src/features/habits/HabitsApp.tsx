/**
 * HabitsApp - Main habits screen
 * Orchestrates the habits list, modals, overlays, and floating action button
 */

import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeColors } from '../../theme/ThemeContext';
import { HabitsPageSkeleton } from '../../components/SkeletonLoader';

import { HabitsList } from './components/HabitsList';
import FloatingActionButton from './components/FloatingActionButton';
import { SyncStatusOverlays } from './components/SyncStatusOverlays';
import { HabitsAppOverlays } from './components/HabitsAppOverlays';
import { useHabitsApp } from './hooks/useHabitsApp';
import React, { useMemo } from 'react';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useHabitsAppHandlers } from './useHabitsAppHandlers';
import { usePerfectDayStreak } from '../../hooks/usePerfectDayStreak';
import { usePerfectDayDetection } from '../../hooks/usePerfectDayDetection';
import { PerfectDayCelebration } from '../../components/PerfectDayCelebration';
import { getLocalDateString } from '../../utils/getLocalDateString';

export function HabitsApp() {
  const { colors } = useThemeColors();
  const { list, modals } = useHabitsApp();

  // Perfect day detection & streak tracking
  const todayString = getLocalDateString();
  const totalHabits = list.habits.length;
  const completedToday = list.habits.filter(
    (h) => list.getHabitStatus(h._id, todayString) === 'done'
  ).length;

  const perfectDayStreak = usePerfectDayStreak();
  const { showCelebration, dismissCelebration } = usePerfectDayDetection({
    completedToday,
    totalHabits,
    enabled: list.celebrationsEnabled,
  });

  // Record perfect day when celebration triggers
  React.useEffect(() => {
    if (showCelebration) {
      void perfectDayStreak.recordPerfectDay();
    }
  }, [showCelebration]);

  const { triggerSelection, triggerWarning } = useHapticFeedback({
    isEnabled: list.celebrationsEnabled,
    preference: list.reduceMotionPreference,
  });

  const {
    handleCreateHabitRequest,
    handlePaywallClose,
    handlePaywallSuccess,
    handleUpgradeConfirm,
    handleUpgradeDismiss,
    handleUpgradeIntent,
    paywallVisible,
    upgradePromptVisible,
  } = useHabitsAppHandlers({
    hasReachedHabitLimit: list.hasReachedHabitLimit,
    isPremiumUser: list.isPremiumUser,
    openCreateHabitScreen: modals.openCreateHabitScreen,
    triggerSelection,
    triggerWarning,
  });

  const showHabitsSkeleton = list.isHabitsLoading && list.habits.length === 0;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <SyncStatusOverlays />

        {showHabitsSkeleton ? (
          <HabitsPageSkeleton reduceMotion={list.reduceMotionPreference} />
        ) : (
          <HabitsList
            canNavigateForward={list.canNavigateForward}
            list={list}
            modals={modals}
            upgradePromptVisible={upgradePromptVisible}
            weekDates={list.weekDates}
            onCreateHabitRequest={handleCreateHabitRequest}
            onNextWeek={list.handleNextWeek}
            onPreviousWeek={list.handlePreviousWeek}
            onUpgradeConfirm={handleUpgradeConfirm}
            onUpgradeDismiss={handleUpgradeDismiss}
            onUpgradeIntent={handleUpgradeIntent}
            perfectDayStreak={perfectDayStreak.currentStreak}
          />
        )}

        {list.habits.length > 0 && (
          <View className='absolute bottom-8 right-6'>
            <FloatingActionButton
              celebrationsEnabled={list.celebrationsEnabled}
              openCreateHabitScreen={(): void => {
                void handleCreateHabitRequest();
              }}
              reduceMotionPreference={list.reduceMotionPreference}
            />
          </View>
        )}

        <HabitsAppOverlays
          list={list}
          modals={modals}
          paywallVisible={paywallVisible}
          onPaywallClose={handlePaywallClose}
          onPaywallSuccess={handlePaywallSuccess}
        />

        <PerfectDayCelebration
          isPremiumUser={list.isPremiumUser}
          perfectDayStreak={perfectDayStreak.currentStreak}
          reduceMotion={list.reduceMotionPreference}
          visible={showCelebration}
          onDismiss={dismissCelebration}
          onUpgradePress={handleUpgradeIntent}
        />
      </View>
    </GestureHandlerRootView>
  );
}

export default HabitsApp;
