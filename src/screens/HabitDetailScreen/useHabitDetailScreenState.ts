import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * useHabitDetailScreenState - State management for the habit detail screen.
 *
 * Completion, streak, and totals are derived from the SAME merged source the
 * habit card uses: server tracking overlaid with the shared optimistic store
 * (`pendingToggles`). This keeps the detail in lock-step with the card and lets
 * the calendar + hero react instantly to a toggle, then self-reconcile.
 */

import { useMemo, useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../features/habits/types';
import { buildCompletedDatesByHabit } from '../../features/habits/hooks/useHabitsTracking.helpers';
import { useOptimisticStore } from '../../lib/optimistic';
import { computeCurrentStreakFromDates } from '../../utils/streak';

interface UseHabitDetailScreenStateProps {
  bestStreak: number;
  habitId: Id<'habits'> | undefined;
  tracking: HabitTrackingEntry[];
  visible?: boolean;
}

export const useHabitDetailScreenState = ({
  bestStreak,
  habitId,
  tracking,
  visible: _visible,
}: UseHabitDetailScreenStateProps) => {
  // Delete/Archive undo toast states (T3.5: Swipe-to-delete)
  const [pendingDelete, setPendingDelete] = useState(false);
  const [pendingArchive, setPendingArchive] = useState(false);

  // Calendar toggling state — date of the cell awaiting mutation response
  const [pendingToggleDate, setPendingToggleDate] = useState<string | null>(
    null
  );

  const today = useMemo(() => getLocalDateString(), []);
  const todayDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const { pendingToggles } = useOptimisticStore();

  // Stable string key so `completedDates` keeps a stable identity across
  // unrelated store changes and in-modal month navigation (protects memoized
  // calendar grids from churn).
  const completedDatesKey = useMemo(() => {
    if (!habitId) return '';
    const byHabit = buildCompletedDatesByHabit(tracking ?? [], pendingToggles);
    const dates = byHabit.get(habitId);
    if (!dates || dates.size === 0) return '';
    return [...dates].sort().join(',');
  }, [habitId, tracking, pendingToggles]);

  const completedDates = useMemo(() => {
    if (!completedDatesKey) {
      return new Set<string>();
    }
    return new Set(completedDatesKey.split(','));
  }, [completedDatesKey]);

  const currentStreak = useMemo(
    () => computeCurrentStreakFromDates(completedDates, todayDate),
    [completedDates, todayDate]
  );

  return {
    bestStreak: Math.max(bestStreak, currentStreak),
    completedDates,
    currentStreak,
    isCompletedToday: completedDates.has(today),
    pendingArchive,
    pendingDelete,
    pendingToggleDate,
    setPendingToggleDate,
    setPendingArchive,
    setPendingDelete,
    totalCompletions: completedDates.size,
  };
};
