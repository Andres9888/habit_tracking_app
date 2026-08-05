import { useCallback, useEffect, useRef, useState } from 'react';
import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * useHabitCardState Hook
 *
 * Manages completion and streak state for HabitCard,
 * integrating server data with offline queue operations.
 *
 * @see docs/offline-habit-sync.md T013 - Offline state integration
 */

import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useToggleHabitWithTimezone } from '../../../hooks/useToggleHabitWithTimezone';
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
  toggleOptimistic: () => void;
}

/**
 * Hook to manage habit completion and streak state
 *
 * Uses the completedProp from the parent's bulk tracking query
 * instead of per-card individual queries, reducing Convex
 * subscriptions from N (one per habit) to 1 (bulk).
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
  // Use the parent-provided completion status from the bulk tracking query
  // instead of creating a per-card Convex subscription (getCompletionStatus).
  // This reduces WebSocket subscriptions from N to 0 for completion checks.
  const serverCompleted = completedProp;
  const toggleCompletionMutation = useToggleHabitWithTimezone();

  // Optimistic local state for instant visual feedback
  const [optimisticCompleted, setOptimisticCompleted] = useState<
    boolean | null
  >(null);
  const prevServerCompleted = useRef(serverCompleted);

  // Reset optimistic state when server catches up
  useEffect(() => {
    if (prevServerCompleted.current !== serverCompleted) {
      prevServerCompleted.current = serverCompleted;
      setOptimisticCompleted(null);
    }
  }, [serverCompleted]);

  const toggleOptimistic = useCallback(() => {
    const current = optimisticCompleted ?? serverCompleted;
    setOptimisticCompleted(!current);
  }, [optimisticCompleted, serverCompleted]);

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
  // Optimistic state takes priority for instant feedback
  const resolvedServerCompleted = offlineSyncEnabled
    ? offlineState.completed
    : serverCompleted;
  const completed = optimisticCompleted ?? resolvedServerCompleted;
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
    toggleOptimistic,
  };
}
