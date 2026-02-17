/* eslint-disable max-lines */
/**
 * HabitsModalsState Hook
 *
 * State hook for habits modals with offline support.
 * Integrates optimistic updates and offline queue for habit toggling.
 *
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

  // Wrap toggle mutation as plain async function
  const wrappedToggleHabit = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      await toggleHabit(args);
    },
    [toggleHabit]
  );

  // Wrap toggle mutation with optimistic update + offline queue support (T011)
  const optimisticToggleHabit = useOptimisticToggleMutation(
    wrappedToggleHabit,
    isCompleted,
    { isOnline }
  );

  useSyncAllHabitStates(habits, selection);

  // Wrap mutations as plain async functions to match handler type signatures
  const wrappedPauseHabit = useCallback(
    async (args: { habitId: Id<'habits'> }) => {
      await pauseHabit(args);
    },
    [pauseHabit]
  );
  const wrappedRemoveHabit = useCallback(
    async (args: { habitId: Id<'habits'> }) => {
      await removeHabit(args);
    },
    [removeHabit]
  );
  const wrappedUpdateSettings = useCallback(
    async (s: Parameters<typeof updateSettings>[0]) => {
      await updateSettings(s);
    },
    [updateSettings]
  );

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

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  const onChangeCelebrationsEnabled = useCallback(
    async (value: boolean) =>
      handlers.onSettingsChange({ showMotivationalMessages: value }),
    [handlers]
  );

  const handleToggleHabit = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      const wasCompleted = isCompleted(args.habitId, args.date);
      const habit = habits.find((h) => h._id === args.habitId);
      
      // Use optimistic toggle with offline queue support
      await optimisticToggleHabit(args);
      
      // Show completion note prompt if marking as complete (not uncompleting)
      if (!wasCompleted && habit) {
        selection.setCompletionNoteContext({
          habitId: args.habitId,
          habitName: habit.name,
          date: args.date,
        });
        visibility.setShowCompletionNote(true);
      }
    },
    [optimisticToggleHabit, isCompleted, habits, selection, visibility]
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
