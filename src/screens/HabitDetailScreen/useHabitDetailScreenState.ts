import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * useHabitDetailScreenState - State management for the habit detail screen
 */

import { useMemo, useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../features/habits/types';
import { useOptimisticToggle } from '../../lib/optimistic/hooks/useOptimisticState';
import { applyOptimisticToday } from './optimisticToday';

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

  // Calendar toggling state — date of the cell awaiting mutation response
  const [pendingToggleDate, setPendingToggleDate] = useState<string | null>(
    null
  );

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

  // Completed dates set - only recalculates when the actual dates change
  // Note: ''.split(',') returns [''] not [], so we must check for empty string first
  const completedDates = useMemo(() => {
    if (!completedDatesKey) {
      return new Set<string>();
    }
    return new Set(completedDatesKey.split(','));
  }, [completedDatesKey]);

  // Overlay any pending optimistic toggle for today so the hero (Done button,
  // streak, total) reacts instantly like the calendar, then self-reconciles.
  const optimisticToggle = useOptimisticToggle(
    (habitId ?? '') as Id<'habits'>,
    today
  );
  const optimistic = applyOptimisticToday(
    {
      bestStreak,
      completedToday: completedDates.has(today),
      currentStreak,
      totalCompletions: completedDates.size,
    },
    optimisticToggle
  );

  return {
    bestStreak: optimistic.bestStreak,
    completedDates,
    currentStreak: optimistic.currentStreak,
    isCompletedToday: optimistic.isCompletedToday,
    pendingArchive,
    pendingDelete,
    pendingToggleDate,
    setPendingToggleDate,
    setPendingArchive,
    setPendingDelete,
    totalCompletions: optimistic.totalCompletions,
  };
};
