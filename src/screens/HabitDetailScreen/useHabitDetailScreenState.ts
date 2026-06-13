import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * useHabitDetailScreenState - State management for the habit detail screen
 */

import { useMemo, useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../features/habits/types';

interface UseHabitDetailScreenStateProps {
  habitCreatedAt: number | undefined;
  habitId: Id<'habits'> | undefined;
  habitStrength: number;
  tracking: HabitTrackingEntry[];
  visible?: boolean;
}

export const useHabitDetailScreenState = ({
  habitCreatedAt,
  habitId,
  habitStrength,
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

  const isCompletedToday = completedDates.has(today);

  // Days tracking calculation
  const daysTracking = useMemo(() => {
    return habitCreatedAt
      ? Math.max(
          0,
          Math.floor((Date.now() - habitCreatedAt) / (1000 * 60 * 60 * 24))
        )
      : 0;
  }, [habitCreatedAt]);

  const totalCompletions = useMemo(() => completedDates.size, [completedDates]);

  const strengthPercent = useMemo(
    () => Math.max(0, Math.min(100, habitStrength * 100)),
    [habitStrength]
  );

  return {
    completedDates,
    daysTracking,
    isCompletedToday,
    pendingArchive,
    pendingDelete,
    pendingToggleDate,
    setPendingToggleDate,
    setPendingArchive,
    setPendingDelete,
    strengthPercent,
    today,
    totalCompletions,
  };
};
