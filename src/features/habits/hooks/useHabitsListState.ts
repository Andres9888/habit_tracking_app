import { useCallback, useMemo, useState, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSettings, HabitSortMode, RewardToastData } from '../types';
import { logInteraction } from '../../../lib/analytics/interactions';
import { useHabitsWeekDates } from './useHabitsWeekDates';
import { useHabitsTracking } from './useHabitsTracking';
import type { HabitsListState } from './types';

interface ArchiveUndoState {
  visible: boolean;
  habitId: Id<'habits'> | null;
  habitName: string;
}

export function useHabitsListState(): HabitsListState {
  const [showHabitStrengthPercentage, setShowHabitStrengthPercentage] = useState(true);

  const toggleHabitMutation = useMutation(api.habits.toggleHabit);
  const archiveHabitMutation = useMutation(api.habits.archive);
  const unarchiveHabitMutation = useMutation(api.habits.unarchive);
  const reorderHabits = useMutation(api.habits.reorderHabits);

  // Archive undo toast state
  const [archiveUndo, setArchiveUndo] = useState<ArchiveUndoState>({
    visible: false,
    habitId: null,
    habitName: '',
  });

  const habitsQuery = useQuery(api.habits.list);
  const habitsFromQuery = (habitsQuery ?? []) as Habit[];
  const isHabitsLoading = habitsQuery === undefined;

  const [rewardToast, setRewardToast] = useState<RewardToastData | null>(null);

  const settingsQuery = useQuery(api.settings.get);
  const settings = (settingsQuery ?? undefined) as HabitSettings | undefined;
  const celebrationsEnabled = settings?.showMotivationalMessages ?? true;
  const dayShape = settings?.dayShape ?? 'square';
  const habitSortMode: HabitSortMode = settings?.habitSortMode ?? 'manual';
  const habitCompletionIcon = settings?.habitCompletionIcon ?? 'chain';
  const reduceMotionPreference = settings?.reduceMotion ?? false;
  const isPremiumUser = settings?.hasPremium ?? false;
  const showWeekCompletionBar = settings?.showWeekCompletionBar ?? true;

  const FREE_HABIT_LIMIT = 3;

  const { today, weekDates, weekDateStrings, extendedDateStrings, canNavigateForward, handleNextWeek, handlePreviousWeek } = useHabitsWeekDates();
  const { getStreak, getHabitStatus } = useHabitsTracking(extendedDateStrings, today);

  const habits = useMemo(() => {
    if (habitSortMode === 'manual') {
      return habitsFromQuery;
    }

    const sortedHabits = [...habitsFromQuery];

    // Day Phase sorting (Push → Pivot → Pull, then unassigned)
    if (habitSortMode === 'day_phase') {
      const phaseOrder: Record<string, number> = {
        phase1_push: 0,
        morning: 0, // Legacy mapping
        phase2_pivot: 1,
        afternoon: 1, // Legacy mapping
        phase3_pull: 2,
        evening: 2, // Legacy mapping
      };

      sortedHabits.sort((a, b) => {
        const aPhase = a.preferredTime ? (phaseOrder[a.preferredTime] ?? 99) : 99;
        const bPhase = b.preferredTime ? (phaseOrder[b.preferredTime] ?? 99) : 99;

        if (aPhase !== bPhase) {
          return aPhase - bPhase;
        }

        // Secondary sort by name for habits in same phase
        const aName = a.name.trim().toLowerCase();
        const bName = b.name.trim().toLowerCase();
        return aName.localeCompare(bName);
      });
      return sortedHabits;
    }

    if (habitSortMode === 'name_asc' || habitSortMode === 'name_desc') {
      sortedHabits.sort((a, b) => {
        const aName = a.name.trim().toLowerCase();
        const bName = b.name.trim().toLowerCase();

        if (aName === bName) {
          return 0;
        }

        const direction = habitSortMode === 'name_asc' ? 1 : -1;
        return aName < bName ? -1 * direction : 1 * direction;
      });
      return sortedHabits;
    }

    if (habitSortMode === 'strength_asc' || habitSortMode === 'strength_desc') {
      const direction = habitSortMode === 'strength_desc' ? -1 : 1;
      sortedHabits.sort((a, b) => {
        const aStrength = a.strength ?? 0;
        const bStrength = b.strength ?? 0;
        if (aStrength !== bStrength) {
          return (aStrength - bStrength) * direction;
        }

        const aName = a.name.trim().toLowerCase();
        const bName = b.name.trim().toLowerCase();
        if (aName === bName) {
          return 0;
        }
        return aName < bName ? -1 : 1;
      });
      return sortedHabits;
    }

    const streakByHabitId = new Map(
      sortedHabits.map((habit) => [
        habit._id,
        habit.currentStreak ?? getStreak(habit._id),
      ])
    );

    const direction = habitSortMode === 'streak_desc' ? -1 : 1;
    sortedHabits.sort((a, b) => {
      const aStreak = streakByHabitId.get(a._id) ?? 0;
      const bStreak = streakByHabitId.get(b._id) ?? 0;
      if (aStreak !== bStreak) {
        return (aStreak - bStreak) * direction;
      }

      const aName = a.name.trim().toLowerCase();
      const bName = b.name.trim().toLowerCase();
      if (aName === bName) {
        return 0;
      }
      return aName < bName ? -1 : 1;
    });

    return sortedHabits;
  }, [getStreak, habitSortMode, habitsFromQuery]);

  const habitSlotsUsed = isPremiumUser
    ? habits.length
    : Math.min(habits.length, FREE_HABIT_LIMIT);
  const hasReachedHabitLimit = !isPremiumUser && habits.length >= FREE_HABIT_LIMIT;

  const openCreateHabitScreen = useCallback(() => {
    // This will be handled by the parent component
  }, []);

  const handleDragEnd = useCallback(
    async ({ data }: { data: Habit[] }) => {
      if (habitSortMode !== 'manual') {
        return;
      }

      try {
        const habitIds = data.map((h) => h._id);
        await reorderHabits({ habitIds });
      } catch (error) {
        console.error('Failed to reorder habits:', error);
      }
    },
    [habitSortMode, reorderHabits]
  );

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      // Find the habit name before archiving (for undo toast)
      const habit = habits.find((h) => h._id === habitId);
      const habitName = habit?.name ?? 'Habit';

      await archiveHabitMutation({ habitId });

      // Show undo toast
      setArchiveUndo({
        visible: true,
        habitId,
        habitName,
      });

      logInteraction('habit_archived', {
        habitId,
        habitName,
      });
    },
    [archiveHabitMutation, habits]
  );

  const handleArchiveUndo = useCallback(async () => {
    if (archiveUndo.habitId) {
      await unarchiveHabitMutation({ habitId: archiveUndo.habitId });
      logInteraction('habit_archive_undone', {
        habitId: archiveUndo.habitId,
        habitName: archiveUndo.habitName,
      });
    }
    setArchiveUndo({ visible: false, habitId: null, habitName: '' });
  }, [archiveUndo.habitId, archiveUndo.habitName, unarchiveHabitMutation]);

  const dismissArchiveUndo = useCallback(() => {
    setArchiveUndo({ visible: false, habitId: null, habitName: '' });
  }, []);

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
    dayShape,
    freeHabitLimit: FREE_HABIT_LIMIT,
    habits,
    habitSortMode,
    habitCompletionIcon,
    isHabitsLoading,
    hasReachedHabitLimit,
    weekDates,
    weekDateStrings,
    canNavigateForward,
    showHabitStrengthPercentage,
    showWeekCompletionBar,
    contentPadding: { paddingHorizontal: 24, paddingTop: 0, paddingBottom: 96 },
    dismissRewardToast,
    handleDragEnd,
    handleArchive,
    handleArchiveUndo,
    dismissArchiveUndo,
    archiveUndoVisible: archiveUndo.visible,
    archiveUndoHabitName: archiveUndo.habitName,
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
