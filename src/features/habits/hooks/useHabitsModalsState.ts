import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { useHabitMutations } from './useHabitMutations';
import { useHabitMilestones } from './useHabitMilestones';
import { useHabitsTracking } from './useHabitsTracking';
import { useHabitStateSync } from './useHabitStateSync';
import { useHabitsModalsHandlers } from './useHabitsModalsHandlers';
import { useModalVisibilityState } from './useModalVisibilityState';
import { useHabitSelectionState } from './useHabitSelectionState';
import { useHabitsSettings } from './useHabitsSettings';
import { buildModalsStateReturnValue } from './buildModalsStateReturnValue';
import { buildModalsSettersArg } from './buildModalsSettersArg';
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
    habits,
    clearMilestone,
    handleArchive,
    getStreak,
    handleToggleHabit,
    milestone,
    onChangeCelebrationsEnabled,
    reduceMotionPreference,
    settings,
    showHabitStrengthPercentage,
    tracking,
  });
}

function generateDateStrings(days: number): string[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });
}

function getTodayMidnight(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function useSyncAllHabitStates(
  habits: Habit[],
  sel: ReturnType<typeof useHabitSelectionState>
): void {
  useHabitStateSync(
    habits,
    sel.selectedHabit,
    sel.setSelectedHabit,
    'selectedHabit'
  );
  useHabitStateSync(habits, sel.habitToEdit, sel.setHabitToEdit);
  useHabitStateSync(habits, sel.habitToPause, sel.setHabitToPause);
  useHabitStateSync(habits, sel.quickActionsHabit, sel.setQuickActionsHabit);
  useHabitStateSync(
    habits,
    sel.activationModalHabit,
    sel.setActivationModalHabit
  );
}
