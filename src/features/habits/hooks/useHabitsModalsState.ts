/* eslint-disable max-lines */
/**
 * HabitsModalsState Hook
 *
 * State hook for habits modals with offline support.
 * Integrates optimistic updates and offline queue for habit toggling.
 *
 * @see docs/offline-habit-sync.md T011
 */

import { useCallback, useMemo } from 'react';
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
import { getLocalDateString } from '@/utils/getLocalDateString';
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
  const {
    archivedHabitsCount,
    settings,
    celebrationsEnabled,
    reduceMotionPreference,
  } = useHabitsSettings();

  const {
    pauseHabit,
    removeHabit,
    updateSettings,
    toggleHabit,
    archiveHabit,
    isOnline,
  } = useHabitMutations();
  const { milestone, clearMilestone } = useHabitMilestones(habits, false);

  const todayKey = getLocalDateString();
  const trackingDates = useMemo(() => generateDateStrings(365), [todayKey]);
  const todayMidnight = useMemo(() => getTodayMidnight(), [todayKey]);

  const { tracking, getStreak, isCompleted } = useHabitsTracking(
    trackingDates,
    todayMidnight
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
      // Use optimistic toggle with offline queue support
      await optimisticToggleHabit(args);
    },
    [optimisticToggleHabit]
  );

  return buildModalsStateReturnValue(visibility, selection, handlers, {
    archivedHabitsCount,
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
