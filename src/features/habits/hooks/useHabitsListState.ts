/* eslint-disable max-lines, max-lines-per-function */
/**
 * HabitsListState Hook
 *
 * Main state hook for the habits list view with offline support.
 * Integrates optimistic updates and offline queue for habit toggling.
 *
 * @see docs/offline-habit-sync.md T011
 */

import { addDays, format, parse } from 'date-fns';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useCachedQuery } from '../../../lib/queryCache';
import type { PartialProgressEmojiSet } from '../../../utils/progressEmojis';
import type {
  Habit,
  HabitStatus,
  HabitSettings,
  HabitSortMode,
} from '../types';
import { useHabitsWeekDates } from './useHabitsWeekDates';
import { useHabitsTracking } from './useHabitsTracking';
import { useHabitsSorting } from './useHabitsSorting';
import { useHabitsArchive } from './useHabitsArchive';
import { useHabitDelete } from './useHabitDelete';
import { useRewardToast } from './useRewardToast';
import { useHabitsListHeaderStats } from './useHabitsListHeaderStats';
import {
  useOptimisticToggleMutation,
  usePendingHiddenHabitIds,
} from '../../../lib/optimistic';
import { usePendingHabitUpdates } from './optimisticHabitUpdateStore';
import { useOptimisticDragEnd } from './useOptimisticDragEnd';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { useToggleHabitWithTimezone } from '../../../hooks/useToggleHabitWithTimezone';
import { useCompletionSound } from '../../../hooks/useCompletionSound';
import { validateHabitsArray } from '../../../utils/validation';
import type { HabitsListState } from './types';
import {
  optimisticHabitCreationStore,
  usePendingCreatedHabits,
} from './optimisticHabitCreationStore';

type HabitStrengthPrediction = {
  baselineStrength: number;
  strength: number;
  updatedAt: number;
};

const STRENGTH_GROWTH_RATE = 0.03;
const STRENGTH_BASE_DECAY = 0.02;
const STRENGTH_SHIELD_EFFECTIVENESS = 0.7;
const STRENGTH_PREDICTION_TTL_MS = 6000;
const STRENGTH_PREDICTION_TOLERANCE = 0.0005;
const STRENGTH_TOGGLE_WINDOW_DAYS = 7;
const HABIT_DATE_FORMAT = 'yyyy-MM-dd';

function clampStrength(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function estimateHabitStrengthAfterToggle(
  currentStrength: number,
  willMarkCompleted: boolean,
  completionsLast7Days: number
): number {
  const sanitizedStrength = clampStrength(currentStrength);
  const clampCompletions = Math.max(
    0,
    Math.min(STRENGTH_TOGGLE_WINDOW_DAYS, completionsLast7Days)
  );

  if (willMarkCompleted) {
    const gapToMax = 1 - sanitizedStrength;
    return clampStrength(sanitizedStrength + gapToMax * STRENGTH_GROWTH_RATE);
  }

  const streakShield = clampCompletions / STRENGTH_TOGGLE_WINDOW_DAYS;
  const protectedDecay =
    STRENGTH_BASE_DECAY * (1 - streakShield * STRENGTH_SHIELD_EFFECTIVENESS);
  return clampStrength(sanitizedStrength * (1 - protectedDecay));
}

function countRecentCompletions(
  getHabitStatus: (habitId: Habit['_id'], dateString: string) => HabitStatus,
  habitId: Habit['_id'],
  dateString: string
): number {
  const date = parse(dateString, HABIT_DATE_FORMAT, new Date());
  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  let completions = 0;
  for (
    let dayOffset = 1;
    dayOffset <= STRENGTH_TOGGLE_WINDOW_DAYS;
    dayOffset++
  ) {
    const previousDate = addDays(date, -dayOffset);
    const previousDateString = format(previousDate, HABIT_DATE_FORMAT);

    if (getHabitStatus(habitId, previousDateString) === 'done') {
      completions += 1;
    }
  }

  return completions;
}

type HabitsListSettings = HabitSettings & {
  progressEmojis?: PartialProgressEmojiSet;
  showGradientFill?: boolean;
};

export function useHabitsListState(): HabitsListState {
  const [showHabitStrengthPercentage] = useState(true);
  const isOnline = useIsOnline();
  const toggleHabitMutation = useToggleHabitWithTimezone();
  const reorderHabits = useMutation(api.habits.reorderHabits);

  const habitsQuery = useCachedQuery(
    api.habits.list,
    {},
    {
      entryName: 'habits.list',
    }
  );
  // Validate and limit habits array for performance (guards against 100+ habits edge case)
  const habitsValidation = useMemo(
    () => validateHabitsArray(habitsQuery ?? []),
    [habitsQuery]
  );
  const habitsFromQuery = habitsValidation.limited;
  const pendingCreatedHabits = usePendingCreatedHabits();
  const hiddenHabitIds = usePendingHiddenHabitIds();
  const pendingHabitUpdates = usePendingHabitUpdates();
  const isHabitsLoading = habitsQuery === undefined;

  // Offline archive/pause/delete hide a habit optimistically; offline edits
  // patch it in place — neither has a server refresh to reflect the change.
  const visibleHabitsFromQuery = useMemo(() => {
    if (hiddenHabitIds.size === 0 && pendingHabitUpdates.size === 0) {
      return habitsFromQuery;
    }
    const result: Habit[] = [];
    for (const habit of habitsFromQuery) {
      if (hiddenHabitIds.has(habit._id)) continue;
      const patch = pendingHabitUpdates.get(habit._id);
      result.push(patch ? { ...habit, ...(patch as Partial<Habit>) } : habit);
    }
    return result;
  }, [habitsFromQuery, hiddenHabitIds, pendingHabitUpdates]);

  // Warn if habits array was limited
  if (habitsValidation.warning && __DEV__) {
    console.warn('[useHabitsListState]', habitsValidation.warning);
  }

  const settingsQuery = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );
  const settings = (settingsQuery ?? undefined) as
    | HabitsListSettings
    | undefined;
  const celebrationsEnabled = settings?.showMotivationalMessages ?? true;
  const compactView = settings?.compactView ?? false;
  const completionSoundEnabled = settings?.completionSoundEnabled ?? false;
  const completionSoundType = settings?.completionSoundType ?? 'chime';
  const dayShape = settings?.dayShape ?? 'square';
  const habitSortMode: HabitSortMode = settings?.habitSortMode ?? 'manual';
  const habitCompletionIcon = settings?.habitCompletionIcon ?? 'chain';
  const reduceMotionPreference = settings?.reduceMotion ?? false;
  const isPremiumUser = settings?.hasPremium ?? false;
  const showWeekCompletionBar = settings?.showWeekCompletionBar ?? true;
  const showGradientFill = settings?.showGradientFill ?? true;
  const userProgressEmojis = settings?.progressEmojis ?? undefined;

  // Completion sound hook (premium feature)
  const { playCompletionSound } = useCompletionSound({
    soundEnabled: completionSoundEnabled,
    soundType: completionSoundType,
  });

  const weekDatesState = useHabitsWeekDates();
  const { today, extendedDateStrings } = weekDatesState;
  const { getStreak, getHabitStatus, isCompleted } = useHabitsTracking(
    extendedDateStrings,
    today
  );
  const [predictedStrengths, setPredictedStrengths] = useState<
    Map<Habit['_id'], HabitStrengthPrediction>
  >(new Map());
  const cleanupTimersRef = useRef(
    new Map<Habit['_id'], ReturnType<typeof setTimeout>>()
  );

  const habitsById = useMemo(
    () => new Map(habitsFromQuery.map((habit) => [habit._id, habit] as const)),
    [habitsFromQuery]
  );

  useEffect(() => {
    optimisticHabitCreationStore.reconcile(habitsFromQuery);
  }, [habitsFromQuery]);

  const habitsWithOptimisticCreates = useMemo(() => {
    if (pendingCreatedHabits.length === 0) {
      return visibleHabitsFromQuery;
    }

    let maxOrder = 0;
    for (const habit of visibleHabitsFromQuery) {
      maxOrder = Math.max(maxOrder, habit.order ?? maxOrder);
    }

    return [
      ...visibleHabitsFromQuery,
      ...pendingCreatedHabits.map((habit, index) => ({
        ...habit,
        order: habit.order ?? maxOrder + index + 1,
      })),
    ];
  }, [visibleHabitsFromQuery, pendingCreatedHabits]);

  useEffect(() => {
    const timers = cleanupTimersRef.current;

    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }

      timers.clear();
    };
  }, []);

  const habitsServerStrengthById = useMemo(
    () =>
      new Map(
        habitsWithOptimisticCreates.map(
          (habit) => [habit._id, habit.strength ?? 0] as const
        )
      ),
    [habitsWithOptimisticCreates]
  );

  useEffect(() => {
    if (predictedStrengths.size === 0) return;

    setPredictedStrengths((previousPredictions) => {
      if (previousPredictions.size === 0) return previousPredictions;

      const nextPredictions = new Map(previousPredictions);
      let hasChanges = false;

      for (const [habitId, prediction] of previousPredictions) {
        const serverStrength = habitsServerStrengthById.get(habitId);

        if (serverStrength === undefined) {
          nextPredictions.delete(habitId);
          hasChanges = true;
          continue;
        }

        const matchesServer =
          Math.abs(serverStrength - prediction.strength) <=
          STRENGTH_PREDICTION_TOLERANCE;
        const serverChangedFromBaseline =
          Math.abs(serverStrength - prediction.baselineStrength) >
          STRENGTH_PREDICTION_TOLERANCE;

        if (matchesServer || serverChangedFromBaseline) {
          nextPredictions.delete(habitId);
          hasChanges = true;
        }
      }

      return hasChanges ? nextPredictions : previousPredictions;
    });
  }, [habitsServerStrengthById, predictedStrengths]);

  const habitsWithPredictedStrength = useMemo(() => {
    if (predictedStrengths.size === 0) {
      return habitsWithOptimisticCreates;
    }

    return habitsWithOptimisticCreates.map((habit) => {
      const prediction = predictedStrengths.get(habit._id);
      if (!prediction) return habit;

      return {
        ...habit,
        strength: prediction.strength,
      };
    });
  }, [habitsWithOptimisticCreates, predictedStrengths]);

  const habits = useHabitsSorting({
    getStreak,
    habitsFromQuery: habitsWithPredictedStrength,
    habitSortMode,
  });

  const headerStats = useHabitsListHeaderStats({
    getHabitStatus,
    getStreak,
    habits,
    weekDateStrings: weekDatesState.weekDateStrings,
  });

  const archiveState = useHabitsArchive(habits);
  const { handleDelete } = useHabitDelete(habits);
  const rewardState = useRewardToast(celebrationsEnabled, getStreak);

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

  // Latest-ref mirrors: these values get new identities on every toggle
  // (they derive from the optimistic store), which would otherwise give
  // toggleHabit a new identity each render and bust the memo() boundary
  // on every habit card. The callback reads .current instead.
  const toggleDepsRef = useRef({
    baseToggleHabit,
    getHabitStatus,
    habitsById,
    isCompleted,
    predictedStrengths,
  });
  toggleDepsRef.current = {
    baseToggleHabit,
    getHabitStatus,
    habitsById,
    isCompleted,
    predictedStrengths,
  };

  // Wrap toggleHabit to also play completion sound
  const toggleHabit = useCallback(
    async (args: { habitId: Habit['_id']; date: string }) => {
      const {
        baseToggleHabit,
        getHabitStatus,
        habitsById,
        isCompleted,
        predictedStrengths,
      } = toggleDepsRef.current;
      // Check if this will mark as completed (not already completed)
      const currentlyCompleted = isCompleted(args.habitId, args.date);
      const habit = habitsById.get(args.habitId);

      if (habit) {
        const currentStrength =
          predictedStrengths.get(args.habitId)?.strength ?? habit.strength ?? 0;
        const completionsLast7Days = countRecentCompletions(
          getHabitStatus,
          args.habitId,
          args.date
        );
        const nextStrength = estimateHabitStrengthAfterToggle(
          currentStrength,
          !currentlyCompleted,
          completionsLast7Days
        );
        const updatedAt = Date.now();
        const prediction: HabitStrengthPrediction = {
          baselineStrength: currentStrength,
          strength: nextStrength,
          updatedAt,
        };

        // The predicted-strength fill is a non-urgent, cosmetic update. Marking
        // it as a transition keeps it off the tap's critical path so the urgent
        // dot-flip (optimistic store) and open-detail navigation aren't blocked
        // by the all-habits map + re-sort it triggers.
        startTransition(() => {
          setPredictedStrengths((previousPredictions) => {
            const nextPredictions = new Map(previousPredictions);
            nextPredictions.set(args.habitId, prediction);
            return nextPredictions;
          });
        });

        const timers = cleanupTimersRef.current;
        const existingTimer = timers.get(args.habitId);
        if (existingTimer) clearTimeout(existingTimer);

        timers.set(
          args.habitId,
          setTimeout(() => {
            timers.delete(args.habitId);
            startTransition(() => {
              setPredictedStrengths((previousPredictions) => {
                const currentPrediction = previousPredictions.get(args.habitId);
                if (
                  !currentPrediction ||
                  currentPrediction.updatedAt !== updatedAt
                ) {
                  return previousPredictions;
                }

                const nextPredictions = new Map(previousPredictions);
                nextPredictions.delete(args.habitId);
                return nextPredictions;
              });
            });
          }, STRENGTH_PREDICTION_TTL_MS)
        );
      }

      // Call the original toggle function
      const result = await baseToggleHabit(args);

      // Play sound if marking as complete (not uncompleting)
      if (!currentlyCompleted) {
        playCompletionSound();
      }

      return result;
    },
    [playCompletionSound]
  );

  // Stable content padding reference to avoid object re-creation every render
  const contentPadding = useMemo(
    () => ({ paddingBottom: 120, paddingHorizontal: 24, paddingTop: 0 }),
    []
  );

  return {
    averageStrengthPercent: headerStats.averageStrengthPercent,
    canNavigateForward: weekDatesState.canNavigateForward,
    celebrationsEnabled,
    compactView,
    completedToday: headerStats.completedToday,
    completionByDay: headerStats.completionByDay,
    completionSoundEnabled,
    completionSoundType,
    contentPadding,
    currentStreak: headerStats.currentStreak,
    dayShape,
    habitCompletionIcon,
    habits,
    habitSortMode,
    isHabitsLoading,
    showGradientFill,
    showHabitStrengthPercentage,
    showWeekCompletionBar,
    userProgressEmojis,
    weekDates: weekDatesState.weekDates,
    weekDateStrings: weekDatesState.weekDateStrings,
    ...archiveState,
    ...rewardState,
    getHabitStatus,
    getStreak,
    handleDelete,
    handleDragEnd,
    handleHabitPress,
    handleJumpToToday: weekDatesState.handleJumpToToday,
    handleNextWeek: weekDatesState.handleNextWeek,
    handlePreviousWeek: weekDatesState.handlePreviousWeek,
    isPremiumUser,
    openCreateHabitScreen,
    reduceMotionPreference,
    toggleHabit,
  };
}
