import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSettings } from '../types';
import { logInteraction } from '../../../lib/analytics/interactions';
import { useHabitsWeekDates } from './useHabitsWeekDates';
import { useHabitsTracking } from './useHabitsTracking';
import type { HabitsListState } from './types';

export function useHabitsListState(): HabitsListState {
  const [showHabitStrengthPercentage, setShowHabitStrengthPercentage] = useState(true);

  const toggleHabitMutation = useMutation(api.habits.toggleHabit);
  const archiveHabit = useMutation(api.habits.archive);
  const reorderHabits = useMutation(api.habits.reorderHabits);

  const habitsQuery = useQuery(api.habits.list);
  const habits = (habitsQuery ?? []) as Habit[];
  const isHabitsLoading = habitsQuery === undefined;

  const settingsQuery = useQuery(api.settings.get);
  const settings = (settingsQuery ?? undefined) as HabitSettings | undefined;
  const celebrationsEnabled = settings?.showMotivationalMessages ?? true;
  const reduceMotionPreference = settings?.reduceMotion ?? false;
  const isPremiumUser = settings?.hasPremium ?? false;
  const showWeekCompletionBar = settings?.showWeekCompletionBar ?? true;

  const FREE_HABIT_LIMIT = 3;
  const habitSlotsUsed = isPremiumUser
    ? habits.length
    : Math.min(habits.length, FREE_HABIT_LIMIT);
  const hasReachedHabitLimit = !isPremiumUser && habits.length >= FREE_HABIT_LIMIT;

  const { today, weekDates, weekDateStrings, extendedDateStrings, canNavigateForward, handleNextWeek, handlePreviousWeek } = useHabitsWeekDates();
  const { getStreak, getHabitStatus } = useHabitsTracking(extendedDateStrings, today);

  const openCreateHabitScreen = useCallback(() => {
    // This will be handled by the parent component
  }, []);

  const handleDragEnd = useCallback(
    async ({ data }: { data: Habit[] }) => {
      try {
        const habitIds = data.map((h) => h._id);
        await reorderHabits({ habitIds });
      } catch (error) {
        console.error('Failed to reorder habits:', error);
      }
    },
    [reorderHabits]
  );

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  const handleHabitPress = useCallback((habit: Habit) => {
    // This will be handled by the parent component
  }, []);

  const toggleHabit = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      await toggleHabitMutation(args);
    },
    [toggleHabitMutation]
  );

  const notifyWeekCompletion = useCallback(
    ({ habit, completedDate }: { habit: Habit; completedDate: string }) => {
      if (!celebrationsEnabled) {
        return;
      }

      const streak = getStreak(habit._id);

      logInteraction('habit_week_complete', {
        completedDate,
        habitId: habit._id,
        habitName: habit.name,
        streak,
      });
    },
    [celebrationsEnabled, getStreak]
  );

  return {
    celebrationsEnabled,
    freeHabitLimit: FREE_HABIT_LIMIT,
    habits,
    isHabitsLoading,
    hasReachedHabitLimit,
    weekDates,
    weekDateStrings,
    canNavigateForward,
    showHabitStrengthPercentage,
    showWeekCompletionBar,
    contentPadding: { paddingHorizontal: 24, paddingTop: 0, paddingBottom: 96 },
    handleDragEnd,
    handleArchive,
    handleHabitPress,
    handleNextWeek,
    handlePreviousWeek,
    openCreateHabitScreen,
    getHabitStatus,
    getStreak,
    notifyWeekCompletion,
    habitSlotsUsed,
    reduceMotionPreference,
    toggleHabit,
    isPremiumUser,
  };
}
