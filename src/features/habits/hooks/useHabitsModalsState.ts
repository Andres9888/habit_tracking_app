/**
 * HabitsModalsState Hook
 * @see docs/offline-habit-sync.md T011
 */

import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { useHabitMutations } from './useHabitMutations';
import { useHabitMilestones } from './useHabitMilestones';
import { useHabitsTracking } from './useHabitsTracking';
import { useHabitsModalsHandlers } from './useHabitsModalsHandlers';
import { useModalVisibilityState } from './useModalVisibilityState';
import { useHabitSelectionState } from './useHabitSelectionState';
import { useHabitsSettings } from './useHabitsSettings';
import { buildModalsStateReturnValue } from './buildModalsStateReturnValue';
import { buildModalsSettersArg } from './buildModalsSettersArg';
import {
  generateDateStrings,
  getTodayMidnight,
  useSyncAllHabitStates,
} from './modalsStateHelpers';
import { useOptimisticToggleMutation } from '../../../lib/optimistic';
import { useWrappedMutations } from './useWrappedMutations';
import type { HabitsModalsState } from './types';

interface UseHabitsModalsStateProps {
  habits: Habit[];
  showHabitStrengthPercentage: boolean;
}

export function useHabitsModalsState({
  habits,
  showHabitStrengthPercentage,
}: UseHabitsModalsStateProps): HabitsModalsState {
  const visibility = useModalVisibilityState();
  const selection = useHabitSelectionState();
  const { settings, celebrationsEnabled, reduceMotionPreference } =
    useHabitsSettings();
  const {
    pauseHabit,
    removeHabit,
    updateSettings,
    toggleHabit,
    archiveHabit,
    isOnline,
  } = useHabitMutations();
  const { milestone, clearMilestone } = useHabitMilestones(habits, false);
  const { tracking, getStreak, isCompleted } = useHabitsTracking(
    generateDateStrings(365),
    getTodayMidnight()
  );

  const {
    wrappedToggleHabit,
    wrappedPauseHabit,
    wrappedRemoveHabit,
    wrappedUpdateSettings,
    handleArchive,
  } = useWrappedMutations(
    toggleHabit,
    pauseHabit,
    removeHabit,
    updateSettings,
    archiveHabit
  );

  const optimisticToggleHabit = useOptimisticToggleMutation(
    wrappedToggleHabit,
    isCompleted,
    { isOnline }
  );
  useSyncAllHabitStates(habits, selection);

  const handlers = useHabitsModalsHandlers(
    buildModalsSettersArg(visibility, selection),
    {
      clearMilestone,
      habits,
      habitToPause: selection.habitToPause,
      pauseHabit: wrappedPauseHabit,
      removeHabit: wrappedRemoveHabit,
      settings,
      updateSettings: wrappedUpdateSettings,
    }
  );

  const onChangeCelebrationsEnabled = useCallback(
    async (value: boolean) =>
      handlers.onSettingsChange({ showMotivationalMessages: value }),
    [handlers]
  );

  const handleToggleHabit = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      await optimisticToggleHabit(args);
    },
    [optimisticToggleHabit]
  );

  return buildModalsStateReturnValue(visibility, selection, handlers, {
    celebrationsEnabled,
    clearMilestone,
    getStreak,
    habits,
    handleArchive,
    handleToggleHabit,
    milestone,
    onChangeCelebrationsEnabled,
    reduceMotionPreference,
    settings,
    showHabitStrengthPercentage,
    tracking,
  });
}
