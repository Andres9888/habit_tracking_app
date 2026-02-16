/* eslint-disable max-lines, max-lines-per-function */
/**
 * HabitsListState Hook
 *
 * Main state hook for the habits list view with offline support.
 * Integrates optimistic updates and offline queue for habit toggling.
 *
 * @see docs/offline-habit-sync.md T011
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Habit, HabitSettings, HabitSortMode } from '../types';
import { useHabitsWeekDates } from './useHabitsWeekDates';
import { useHabitsTracking } from './useHabitsTracking';
import { useHabitsSorting } from './useHabitsSorting';
import { useHabitsArchive } from './useHabitsArchive';
import { useRewardToast } from './useRewardToast';
import { useOptimisticToggleMutation } from '../../../lib/optimistic';
import { useOptimisticDragEnd } from './useOptimisticDragEnd';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { useToggleHabitWithTimezone } from '../../../hooks/useToggleHabitWithTimezone';
import { useCompletionSound } from '../../../hooks/useCompletionSound';
import { validateHabitsArray } from '../../../utils/validation';
import type { HabitsListState } from './types';

import { FREE_HABIT_LIMIT } from '@/constants';

// Lazy load settings with a slight delay to keep initial render fast.
// Settings are non-critical for initial list render; defaults are applied
// if not yet loaded. This parallelizes the settings fetch without blocking.
function useSettingsWithFallback() {
  const [shouldFetchSettings, setShouldFetchSettings] = useState(false);

  // Start fetching settings after a brief delay (allows habits to render first)
  useEffect(() => {
    const timeoutId = setTimeout(() => setShouldFetchSettings(true), 0);
    return () => clearTimeout(timeoutId);
  }, []);

  // Only fire query when flag is set (or pass undefined to skip initially)
  const settingsQuery = useQuery(shouldFetchSettings ? api.settings.get : null);
  return settingsQuery;
}

export function useHabitsListState(): HabitsListState {
  const [showHabitStrengthPercentage] = useState(true);
  const isOnline = useIsOnline();
  const toggleHabitMutation = useToggleHabitWithTimezone();
  const reorderHabits = useMutation(api.habits.reorderHabits);

  const habitsQuery = useQuery(api.habits.list);
  // Validate and limit habits array for performance (guards against 100+ habits edge case)
  const habitsValidation = useMemo(
    () => validateHabitsArray(habitsQuery ?? []),
    [habitsQuery]
  );
  const habitsFromQuery = habitsValidation.limited;
  const isHabitsLoading = habitsQuery === undefined;

  // Warn if habits array was limited
  if (habitsValidation.warning && __DEV__) {
    console.warn('[useHabitsListState]', habitsValidation.warning);
  }

  // Fetch settings with deferred query to avoid blocking initial render
  const settingsQuery = useSettingsWithFallback();
  const settings = (settingsQuery ?? undefined) as HabitSettings | undefined;
  const celebrationsEnabled = settings?.showMotivationalMessages ?? true;
  const completionSoundEnabled = settings?.completionSoundEnabled ?? false;
  const completionSoundType = settings?.completionSoundType ?? 'chime';
  const dayShape = settings?.dayShape ?? 'square';
  const habitSortMode: HabitSortMode = settings?.habitSortMode ?? 'manual';
  const habitCompletionIcon = settings?.habitCompletionIcon ?? 'chain';
  const reduceMotionPreference = settings?.reduceMotion ?? false;
  const isPremiumUser = settings?.hasPremium ?? false;
  const showWeekCompletionBar = settings?.showWeekCompletionBar ?? true;

  // Completion sound hook (premium feature)
  const { playCompletionSound } = useCompletionSound({
    soundEnabled: isPremiumUser && completionSoundEnabled,
    soundType: completionSoundType,
  });

  const weekDatesState = useHabitsWeekDates();
  const { today, extendedDateStrings } = weekDatesState;
  const { getStreak, getHabitStatus, isCompleted } = useHabitsTracking(
    extendedDateStrings,
    today
  );

  const habits = useHabitsSorting({
    getStreak,
    habitsFromQuery,
    habitSortMode,
  });

  const archiveState = useHabitsArchive(habits);
  const rewardState = useRewardToast(celebrationsEnabled, getStreak);

  const habitSlotsUsed = isPremiumUser
    ? habits.length
    : Math.min(habits.length, FREE_HABIT_LIMIT);
  const hasReachedHabitLimit =
    !isPremiumUser && habits.length >= FREE_HABIT_LIMIT;

  const openCreateHabitScreen = useCallback(() => {
    // Handled by parent component
  }, []);

  const handleDragEnd = useOptimisticDragEnd(
    habitSortMode,
    habits,
    reorderHabits
  );

  const handleHabitPress = useCallback((_habit: Habit) => {
    // Handled by parent component
  }, []);

  // Wrap toggle mutation with optimistic update for immediate feedback
  // Pass isOnline for offline queue integration (T011)
  const baseToggleHabit = useOptimisticToggleMutation(
    toggleHabitMutation,
    isCompleted,
    { isOnline }
  );

  // Wrap toggleHabit to also play completion sound
  const toggleHabit = useCallback(
    async (args: { habitId: Habit['_id']; date: string }) => {
      // Check if this will mark as completed (not already completed)
      const currentlyCompleted = isCompleted(args.habitId, args.date);

      // Call the original toggle function
      const result = await baseToggleHabit(args);

      // Play sound if marking as complete (not uncompleting)
      if (!currentlyCompleted) {
        playCompletionSound();
      }

      return result;
    },
    [baseToggleHabit, isCompleted, playCompletionSound]
  );

  // Stable content padding reference to avoid object re-creation every render
  const contentPadding = useMemo(
    () => ({ paddingBottom: 96, paddingHorizontal: 24, paddingTop: 0 }),
    []
  );

  return {
    canNavigateForward: weekDatesState.canNavigateForward,
    celebrationsEnabled,
    completionSoundEnabled,
    completionSoundType,
    contentPadding,
    dayShape,
    freeHabitLimit: FREE_HABIT_LIMIT,
    habitCompletionIcon,
    habits,
    habitSortMode,
    hasReachedHabitLimit,
    isHabitsLoading,
    showHabitStrengthPercentage,
    showWeekCompletionBar,
    weekDates: weekDatesState.weekDates,
    weekDateStrings: weekDatesState.weekDateStrings,
    ...archiveState,
    ...rewardState,
    getHabitStatus,
    getStreak,
    habitSlotsUsed,
    handleDragEnd,
    handleHabitPress,
    handleNextWeek: weekDatesState.handleNextWeek,
    handlePreviousWeek: weekDatesState.handlePreviousWeek,
    isPremiumUser,
    openCreateHabitScreen,
    reduceMotionPreference,
    toggleHabit,
  };
}
