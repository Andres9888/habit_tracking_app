import { useCallback, useMemo } from 'react';
import { computeCurrentStreakFromDates } from '../../../utils/streak';
import type { HabitStatus, HabitTrackingEntry } from '../types';

/**
 * Hook for habit tracking calculations and status determination
 *
 * Provides utilities to check completion status, calculate streaks,
 * and determine habit state (done/missed/planned) for any date.
 *
 * @param tracking - Array of tracking entries from Convex
 * @param today - Reference date for streak and status calculations
 * @returns Tracking utilities and memoized data structures
 *
 * @example
 * const { getStreak, getHabitStatus } = useHabitTracking(tracking, new Date());
 * const streak = getStreak(habitId);
 * const status = getHabitStatus(habitId, '2025-12-20');
 */
export function useHabitTracking(tracking: HabitTrackingEntry[], today: Date) {
  /**
   * Memoized map of completed dates by habit ID
   * Key: habit ID, Value: Set of date strings (YYYY-MM-DD)
   */
  const completedDatesByHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const entry of tracking) {
      if (!entry?.completed) continue;
      if (!map.has(entry.habitId)) {
        map.set(entry.habitId, new Set<string>());
      }
      map.get(entry.habitId)!.add(entry.date);
    }
    return map;
  }, [tracking]);

  /**
   * Calculate current streak for a habit
   *
   * Counts consecutive days from today backwards where the habit was completed.
   * Resets when a gap is found.
   *
   * @param habitId - ID of the habit
   * @returns Current streak count (0 if no streak)
   */
  const getStreak = useCallback(
    (habitId: string): number => {
      const completedDates = completedDatesByHabit.get(habitId);
      if (!completedDates) return 0;
      return computeCurrentStreakFromDates(completedDates, today);
    },
    [completedDatesByHabit, today]
  );

  /**
   * Determine habit status for a specific date
   *
   * @param habitId - ID of the habit
   * @param dateString - Date in YYYY-MM-DD format
   * @returns Status: 'done' (completed), 'missed' (past, not done), 'planned' (future)
   */
  const getHabitStatus = useCallback(
    (habitId: string, dateString: string): HabitStatus => {
      const trackingEntry = tracking.find(
        (entry) => entry.habitId === habitId && entry.date === dateString
      );
      if (trackingEntry?.completed) return 'done';

      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);

      if (date < today) return 'missed';
      return 'planned';
    },
    [tracking, today]
  );

  return { completedDatesByHabit, getHabitStatus, getStreak };
}
