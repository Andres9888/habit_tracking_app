/**
 * HabitsApp - Main habits screen
 * Orchestrates the habits list, modals, overlays, and floating action button
 */

import { useMemo } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useQuery } from 'convex/react';

import { useThemeColors } from '../../theme/ThemeContext';
import { HabitsPageSkeleton } from '../../components/SkeletonLoader';
import { api } from '../../../convex/_generated/api';

import { HabitsList } from './components/HabitsList';
import FloatingActionButton from './components/FloatingActionButton';
import { SyncStatusOverlays } from './components/SyncStatusOverlays';
import { HabitsAppOverlays } from './components/HabitsAppOverlays';
import { useHabitsApp } from './hooks/useHabitsApp';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useHabitsAppHandlers } from './useHabitsAppHandlers';
import { MorningCheckinScreen, useMorningCheckin } from '../../screens/MorningCheckinScreen';

function formatDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateString(yesterday);
}

function getTodayDateString(): string {
  return formatDateString(new Date());
}

export function HabitsApp() {
  const { colors } = useThemeColors();
  const { list, modals } = useHabitsApp();
  const { triggerSelection, triggerWarning } = useHapticFeedback({
    isEnabled: list.celebrationsEnabled,
    preference: list.reduceMotionPreference,
  });

  // Get tracking data for yesterday and today
  const yesterdayDate = getYesterdayDateString();
  const todayDate = getTodayDateString();

  const yesterdayTracking = useQuery(
    api.habits.getTracking,
    { dates: [yesterdayDate] }
  );

  const todayTracking = useQuery(
    api.habits.getTracking,
    { dates: [todayDate] }
  );

  // Build yesterday summary
  const yesterdaySummary = useMemo(() => {
    if (!yesterdayTracking || list.habits.length === 0) {
      return null;
    }
    const completed = yesterdayTracking.filter(t => t.completed).length;
    return {
      completed,
      total: list.habits.length,
    };
  }, [yesterdayTracking, list.habits.length]);

  // Build today's habits with completion status
  const todayHabitsWithStatus = useMemo(() => {
    if (list.habits.length === 0) {
      return [];
    }

    const todayCompletedIds = new Set(
      (todayTracking || [])
        .filter(t => t.completed)
        .map(t => t.habitId)
    );

    return list.habits.map(habit => ({
      id: habit._id,
      name: habit.name,
      emoji: habit.emoji || '✨',
      completed: todayCompletedIds.has(habit._id),
    }));
  }, [list.habits, todayTracking]);

  // Morning check-in state
  const { shouldShowCheckin, isLoading: isCheckinLoading, dismissCheckin, checkinData } = useMorningCheckin(
    yesterdaySummary,
    todayHabitsWithStatus
  );

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

  // Don't show check-in while loading habits or check-in data
  const isLoading = list.isHabitsLoading || isCheckinLoading;

  // Show morning check-in overlay if conditions are met
  if (!isLoading && shouldShowCheckin && checkinData) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MorningCheckinScreen
          data={checkinData}
          onDismiss={dismissCheckin}
        />
      </GestureHandlerRootView>
    );
  }

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
      </View>
    </GestureHandlerRootView>
  );
}

export default HabitsApp;
