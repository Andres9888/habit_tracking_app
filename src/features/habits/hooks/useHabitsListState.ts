import { useCallback, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSettings, HabitSortMode } from '../types';
import { useHabitsWeekDates } from './useHabitsWeekDates';
import { useHabitsTracking } from './useHabitsTracking';
import { useHabitsSorting } from './useHabitsSorting';
import { useHabitsArchive } from './useHabitsArchive';
import { useRewardToast } from './useRewardToast';
import type { HabitsListState } from './types';

const FREE_HABIT_LIMIT = 3;

export function useHabitsListState(): HabitsListState {
  const [showHabitStrengthPercentage, setShowHabitStrengthPercentage] =
    useState(true);

  const toggleHabitMutation = useMutation(api.habits.toggleHabit);
  const reorderHabits = useMutation(api.habits.reorderHabits);

  const habitsQuery = useQuery(api.habits.list);
  const habitsFromQuery = habitsQuery ?? [];
  const isHabitsLoading = habitsQuery === undefined;

  const settingsQuery = useQuery(api.settings.get);
  const settings = (settingsQuery ?? undefined) as HabitSettings | undefined;
  const celebrationsEnabled = settings?.showMotivationalMessages ?? true;
  const dayShape = settings?.dayShape ?? 'square';
  const habitSortMode: HabitSortMode = settings?.habitSortMode ?? 'manual';
  const habitCompletionIcon = settings?.habitCompletionIcon ?? 'chain';
  const reduceMotionPreference = settings?.reduceMotion ?? false;
  const isPremiumUser = settings?.hasPremium ?? false;
  const showWeekCompletionBar = settings?.showWeekCompletionBar ?? true;

  const weekDatesState = useHabitsWeekDates();
  const { today, extendedDateStrings } = weekDatesState;
  const { getStreak, getHabitStatus } = useHabitsTracking(
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

  const handleDragEnd = useCallback(
    async ({ data }: { data: Habit[] }) => {
      if (habitSortMode !== 'manual') return;
      try {
        const habitIds = data.map((h) => h._id);
        await reorderHabits({ habitIds });
      } catch (error) {
        console.error('Failed to reorder habits:', error);
      }
    },
    [habitSortMode, reorderHabits]
  );

  const handleHabitPress = useCallback((_habit: Habit) => {
    // Handled by parent component
  }, []);

  const toggleHabit = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      await toggleHabitMutation(args);
    },
    [toggleHabitMutation]
  );

  return {
    canNavigateForward: weekDatesState.canNavigateForward,
    celebrationsEnabled,
    dayShape,
    freeHabitLimit: FREE_HABIT_LIMIT,
    contentPadding: { paddingHorizontal: 24, paddingBottom: 96, paddingTop: 0 },
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
