/**
 * useOfflineHabitState Hook
 *
 * Merges server state with pending offline operations to provide
 * a unified view of habit completion and streak data.
 *
 * @see docs/offline-habit-sync.md T013
 */

import { useMemo } from 'react';
import { calculateOfflineStreak } from '../../../lib/offline/calculations';
import { useOfflineQueue } from '../../../lib/offline/hooks';
import type {
  UseOfflineHabitStateOptions,
  UseOfflineHabitStateReturn,
} from './types';
import {
  filterPendingForHabit,
  getCompletionFromPending,
  toPendingToggleOps,
} from './offlineStateHelpers';

/**
 * Hook to get offline-aware habit state
 */
export function useOfflineHabitState(
  options: UseOfflineHabitStateOptions
): UseOfflineHabitStateReturn {
  const {
    habitId,
    todayDate,
    serverTracking = [],
    serverStreak,
    serverCompleted = false,
  } = options;

  const { operations } = useOfflineQueue();

  const pendingForHabit = useMemo(
    () => filterPendingForHabit(operations, habitId),
    [operations, habitId]
  );

  const hasPendingOperations = pendingForHabit.length > 0;
  const pendingCount = pendingForHabit.length;
  const pendingToggleOps = useMemo(
    () => toPendingToggleOps(pendingForHabit),
    [pendingForHabit]
  );

  const completed = useMemo(
    () =>
      getCompletionFromPending(pendingToggleOps, todayDate, serverCompleted),
    [pendingToggleOps, todayDate, serverCompleted]
  );

  const streakData = useMemo(() => {
    if (!hasPendingOperations && serverStreak) return serverStreak;
    return calculateOfflineStreak(serverTracking, pendingToggleOps, todayDate);
  }, [
    hasPendingOperations,
    serverStreak,
    serverTracking,
    pendingToggleOps,
    todayDate,
  ]);

  return {
    bestStreak: streakData.bestStreak,
    completed,
    currentStreak: streakData.currentStreak,
    hasPendingOperations,
    pendingCount,
  };
}
