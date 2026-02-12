import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * useHabitCardState Hook
 *
 * Manages completion and streak state for HabitCard,
 * integrating server data with offline queue operations.
 *
 * @see docs/offline-habit-sync.md T013 - Offline state integration
 */

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useOfflineHabitState } from './useOfflineHabitState';
import type { HabitCardProps } from '../HabitCard.types';

interface UseHabitCardStateOptions {
  id: HabitCardProps['id'];
  currentStreakProp: number;
  bestStreakProp: number;
  completedProp: boolean;
  serverTracking: HabitCardProps['serverTracking'];
  offlineSyncEnabled: boolean;
}

export interface HabitCardStateReturn {
  completed: boolean;
  currentStreak: number;
  bestStreak: number;
  hasPendingOfflineOps: boolean;
  today: string;
  toggleCompletionMutation: ReturnType<
    typeof useMutation<typeof api.habits.toggleHabit>
  >;
}

/**
 * Hook to manage habit completion and streak state
 */
export function useHabitCardState(
  options: UseHabitCardStateOptions
): HabitCardStateReturn {
  const {
    id,
    currentStreakProp,
    bestStreakProp,
    completedProp,
    serverTracking = [],
    offlineSyncEnabled,
  } = options;

  const today = getLocalDateString();
  const completedQuery = useQuery(api.tracking.getCompletionStatus, {
    date: today,
    habitId: id,
  });
  const serverCompleted = completedQuery ?? completedProp;
  const toggleCompletionMutation = useMutation(api.habits.toggleHabit);

  // Get offline-aware state when offline sync is enabled (T013)
  const offlineState = useOfflineHabitState({
    habitId: id,
    serverCompleted,
    serverStreak: {
      bestStreak: bestStreakProp,
      currentStreak: currentStreakProp,
      lastCompletedDate: '',
    },
    serverTracking,
    todayDate: today,
  });

  // Use offline-aware state when enabled, otherwise use server state
  const completed = offlineSyncEnabled
    ? offlineState.completed
    : serverCompleted;
  const currentStreak = offlineSyncEnabled
    ? offlineState.currentStreak
    : currentStreakProp;
  const bestStreak = offlineSyncEnabled
    ? offlineState.bestStreak
    : bestStreakProp;
  const hasPendingOfflineOps = offlineSyncEnabled
    ? offlineState.hasPendingOperations
    : false;

  return {
    bestStreak,
    completed,
    currentStreak,
    hasPendingOfflineOps,
    today,
    toggleCompletionMutation,
  };
}
