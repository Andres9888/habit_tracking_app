import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * useHabitDetailScreenState - State management for the habit detail screen
 */

import { useCallback, useMemo, useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../features/habits/types';
import { usePendingToggles } from '../../lib/optimistic';
import {
  applyOptimisticStats,
  hasPendingToggleForHabit,
  mergeCompletedDates,
} from './detailOptimistic';

interface UseHabitDetailScreenStateProps {
  bestStreak: number;
  currentStreak: number;
  habitId: Id<'habits'> | undefined;
  tracking: HabitTrackingEntry[];
  visible?: boolean;
}

export const useHabitDetailScreenState = ({
  bestStreak,
  currentStreak,
  habitId,
  tracking,
  visible: _visible,
}: UseHabitDetailScreenStateProps) => {
  // Delete/Archive undo toast states (T3.5: Swipe-to-delete)
  const [pendingDelete, setPendingDelete] = useState(false);
  const [pendingArchive, setPendingArchive] = useState(false);

  // Today's date
  const today = useMemo(() => getLocalDateString(), []);

  // Create a stable string key for completed dates to prevent unnecessary re-renders
  // when tracking array reference changes but content is the same
  const completedDatesKey = useMemo(() => {
    if (!habitId || !tracking || !Array.isArray(tracking)) return '';
    const dates = tracking
      .filter((entry) => entry && entry.habitId === habitId && entry.completed)
      .map((entry) => entry.date)
      .filter((date): date is string => typeof date === 'string');
    if (dates.length === 0) return '';
    return dates.sort().join(',');
  }, [habitId, tracking]);

  // Merge the shared optimistic store's pending toggles (any date, any
  // surface) into the server-derived set, so calendar cells and hero stats
  // paint instantly and reconcile when the server confirms.
  const pendingToggles = usePendingToggles();
  const completedDates = useMemo(
    () => mergeCompletedDates(completedDatesKey, pendingToggles, habitId ?? ''),
    [completedDatesKey, habitId, pendingToggles]
  );

  const isCompletedOn = useCallback(
    (date: string) => completedDates.has(date),
    [completedDates]
  );

  const stats = applyOptimisticStats(
    { bestStreak, currentStreak },
    completedDates,
    hasPendingToggleForHabit(pendingToggles, habitId ?? ''),
    today
  );

  return {
    bestStreak: stats.bestStreak,
    completedDates,
    currentStreak: stats.currentStreak,
    isCompletedOn,
    isCompletedToday: stats.isCompletedToday,
    pendingArchive,
    pendingDelete,
    setPendingArchive,
    setPendingDelete,
    totalCompletions: stats.totalCompletions,
  };
};
