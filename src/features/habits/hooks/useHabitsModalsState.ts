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

  const { pauseHabit, removeHabit, updateSettings, toggleHabit, archiveHabit } =
    useHabitMutations();
  const { milestone, clearMilestone } = useHabitMilestones(habits, false);

  const { tracking, getStreak } = useHabitsTracking(
    generateDateStrings(365),
    getTodayMidnight()
  );

  useSyncAllHabitStates(habits, selection);

  const handlers = useHabitsModalsHandlers(
    buildModalsSettersArg(visibility, selection),
    {
      clearMilestone,
      habits,
      habitToPause: selection.habitToPause,
      pauseHabit,
      removeHabit,
      settings,
      updateSettings,
    }
  );

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => archiveHabit({ habitId }),
    [archiveHabit]
  );

  const onChangeCelebrationsEnabled = useCallback(
    async (value: boolean) =>
      handlers.onSettingsChange({ showMotivationalMessages: value }),
    [handlers]
  );

  const handleToggleHabit = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => toggleHabit(args),
    [toggleHabit]
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
