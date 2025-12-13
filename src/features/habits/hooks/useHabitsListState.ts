import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSettings, RewardToastData } from '../types';
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
  const habitsFromQuery = (habitsQuery ?? []) as Habit[];
  const isHabitsLoading = habitsQuery === undefined;

  const [rewardToast, setRewardToast] = useState<RewardToastData | null>(null);

  const settingsQuery = useQuery(api.settings.get);
  const settings = (settingsQuery ?? undefined) as HabitSettings | undefined;
  const celebrationsEnabled = settings?.showMotivationalMessages ?? true;
  const habitCompletionIcon = settings?.habitCompletionIcon ?? 'chain';
  const reduceMotionPreference = settings?.reduceMotion ?? false;
  const isPremiumUser = settings?.hasPremium ?? false;
  const showWeekCompletionBar = settings?.showWeekCompletionBar ?? true;
  const sortHabitsAlphabetically = settings?.sortHabitsAlphabetically ?? false;

  const habits = useMemo(() => {
    if (!sortHabitsAlphabetically) {
      return habitsFromQuery;
    }

    return [...habitsFromQuery].sort((a, b) => {
      const aName = a.name.trim().toLowerCase();
      const bName = b.name.trim().toLowerCase();
      if (aName < bName) {
        return -1;
      }
      if (aName > bName) {
        return 1;
      }
      return 0;
    });
  }, [habitsFromQuery, sortHabitsAlphabetically]);

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
      if (sortHabitsAlphabetically) {
        return;
      }

      try {
        const habitIds = data.map((h) => h._id);
        await reorderHabits({ habitIds });
      } catch (error) {
        console.error('Failed to reorder habits:', error);
      }
    },
    [reorderHabits, sortHabitsAlphabetically]
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

  const dismissRewardToast = useCallback(() => {
    setRewardToast(null);
  }, []);

  const notifyWeekCompletion = useCallback(
    ({ habit, completedDate }: { habit: Habit; completedDate: string }) => {
      if (!celebrationsEnabled) {
        return;
      }

      const streak = getStreak(habit._id);

      setRewardToast({
        habitId: habit._id,
        habitName: habit.name,
        message:
          'Amazing consistency! Unlock a momentum booster to stack even more wins.',
        streak,
      });

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
    habitCompletionIcon,
    isHabitsLoading,
    hasReachedHabitLimit,
    weekDates,
    weekDateStrings,
    canNavigateForward,
    showHabitStrengthPercentage,
    showWeekCompletionBar,
    sortHabitsAlphabetically,
    contentPadding: { paddingHorizontal: 24, paddingTop: 0, paddingBottom: 96 },
    dismissRewardToast,
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
    rewardToast,
    toggleHabit,
    isPremiumUser,
  };
}
