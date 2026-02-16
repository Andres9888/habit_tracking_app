/**
 * Current streak calculation
 */

import type { HabitTrackingEntry } from '../../../features/habits/types';
import { getTodayString, formatDateString } from '../../../utils/dateUtils';

/**
 * Calculate the current streak from tracking data
 * Uses UTC-normalized date utilities to match backend calculations
 *
 * @param tracking - Array of habit tracking entries
 * @returns Number of consecutive days in the current streak
 */
export function calculateCurrentStreak(tracking: HabitTrackingEntry[]): number {
  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  if (completedDates.size === 0) return 0;

  let streak = 0;
  const todayStr = getTodayString();

  // Start from today or yesterday if today not completed
  let checkDate = todayStr;
  if (!completedDates.has(todayStr)) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    checkDate = formatDateString(yesterday);
  }

  // Count consecutive days backwards
  while (streak < 400) {
    if (completedDates.has(checkDate)) {
      streak++;
      const dateParts = checkDate.split('-').map(Number);
      const year = dateParts[0] ?? 0;
      const month = dateParts[1] ?? 1;
      const day = dateParts[2] ?? 1;
      if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) break;
      const prevDate = new Date(year, month - 1, day);
      prevDate.setDate(prevDate.getDate() - 1);
      checkDate = formatDateString(prevDate);
    } else {
      break;
    }
  }

  return streak;
}
