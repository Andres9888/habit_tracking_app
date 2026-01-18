/**
 * Calculates current streak from tracking data
 * Uses UTC-normalized date utilities to match backend logic
 */

import type { HabitTrackingEntry } from '../../../features/habits/types';
import { getTodayString, formatDateString } from '../../../utils/dateUtils';

/**
 * Maximum streak length to prevent infinite loops
 */
const MAX_STREAK_LENGTH = 400;

/**
 * Calculate the current streak from tracking data
 * @param tracking - Array of habit tracking entries
 * @returns Current streak count (consecutive days)
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
    // Get yesterday using proper date math
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    checkDate = formatDateString(yesterday);
  }

  // Count consecutive days backwards
  while (streak < MAX_STREAK_LENGTH) {
    if (completedDates.has(checkDate)) {
      streak++;
      // Go to previous day
      const [year, month, day] = checkDate.split('-').map(Number);
      const prevDate = new Date(year, month - 1, day);
      prevDate.setDate(prevDate.getDate() - 1);
      checkDate = formatDateString(prevDate);
    } else {
      break;
    }
  }

  return streak;
}
