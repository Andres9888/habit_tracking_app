/* eslint-disable max-lines */
/**
 * HabitsModalsState Hook
 *
 * State hook for habits modals with offline support.
 * Integrates optimistic updates and offline queue for habit toggling.
 *
 * @see docs/offline-habit-sync.md T011
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitTrackingEntry } from '../types';
import { useHabitMutations } from './useHabitMutations';
import { useHabitMilestones } from './useHabitMilestones';
import { useModalTracking } from './useModalTracking';
import { useHabitsModalsHandlers } from './useHabitsModalsHandlers';
import { useModalVisibilityState } from './useModalVisibilityState';
import { useHabitSelectionState } from './useHabitSelectionState';
import { useHabitsSettings } from './useHabitsSettings';
import { buildModalsStateReturnValue } from './buildModalsStateReturnValue';
import { buildModalsSettersArg } from './buildModalsSettersArg';
import { useSyncAllHabitStates } from './modalsStateHelpers';
import { useOptimisticToggleMutation } from '../../../lib/optimistic';
import { sanitizeSettingsPayload } from '../../../lib/settings/sanitizeSettingsPayload';
import { updateSettingsWithFallback } from '../../../lib/settings/updateSettingsWithFallback';
import type { HabitsModalsState } from './types';

interface UseHabitsModalsStateProps {
  habits: Habit[];
  homeTracking: HabitTrackingEntry[];
  showHabitStrengthPercentage: boolean;
}

export function useHabitsModalsState({
  habits,
  homeTracking,
  showHabitStrengthPercentage,
}: UseHabitsModalsStateProps): HabitsModalsState {
  const visibility = useModalVisibilityState();
  const selection = useHabitSelectionState();
  const {
    archivedHabitsCount,
    settings,
    celebrationsEnabled,
    reduceMotionPreference,
  } = useHabitsSettings(visibility.isSettingsOpen);

  const {
    pauseHabit,
    removeHabit,
    updateSettings,
    toggleHabit,
    archiveHabit,
    isOnline,
  } = useHabitMutations();
  const { milestone, clearMilestone } = useHabitMilestones(habits, false);
  const [stickyCalendarHeaderOverride, setStickyCalendarHeaderOverride] =
    useState<boolean>();

  const { tracking, getStreak, isCompleted } = useModalTracking({
    fallbackTracking: homeTracking,
    isExtendedViewVisible:
      visibility.isHabitCalendarOpen || visibility.isHabitDetailOpen,
  });

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
      const updates = sanitizeSettingsPayload(
        s as Record<string, unknown>
      ) as Record<string, unknown>;

      if (
        Object.prototype.hasOwnProperty.call(updates, 'stickyCalendarHeader')
      ) {
        setStickyCalendarHeaderOverride(
          Boolean(updates.stickyCalendarHeader as boolean)
        );
      }

      await updateSettingsWithFallback(updateSettings, updates);
    },
    [updateSettings]
  );

  useEffect(() => {
    if (
      settings?.stickyCalendarHeader !== undefined &&
      stickyCalendarHeaderOverride !== undefined &&
      settings.stickyCalendarHeader === stickyCalendarHeaderOverride
    ) {
      setStickyCalendarHeaderOverride(undefined);
    }
  }, [settings?.stickyCalendarHeader, stickyCalendarHeaderOverride]);

  const settingsWithOverrides = useMemo(() => {
    if (settings === undefined) return settings;
    if (stickyCalendarHeaderOverride === undefined) return settings;
    return {
      ...settings,
      stickyCalendarHeader: stickyCalendarHeaderOverride,
    };
  }, [settings, stickyCalendarHeaderOverride]);
  const handlers = useHabitsModalsHandlers(
    buildModalsSettersArg(visibility, selection),
    {
      clearMilestone,
      habits,
      habitToPause: selection.habitToPause,
      pauseHabit: wrappedPauseHabit,
      removeHabit: wrappedRemoveHabit,
      settings: settingsWithOverrides,
      updateSettings: wrappedUpdateSettings,
    }
  );

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
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
    reduceMotionPreference,
    settings,
    showHabitStrengthPercentage,
    tracking,
  });
}
