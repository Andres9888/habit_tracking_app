/**
 * Calculates streak records from tracking data
 * Uses consistent date calculation to match backend logic
 */

import type { HabitTrackingEntry } from '../../../features/habits/types';
import type { StreakRecord } from '../InsightsSection.types';
import {
  differenceInDays,
  getTodayString,
  formatDateString,
} from '../../../utils/dateUtils';
import { MAX_STREAK_RECORDS_DISPLAY } from '../InsightsSection.constants';

/** Minimum streak length to record */
const MIN_STREAK_DAYS = 2;

/** Create a streak record */
function createRecord(
  days: number,
  start: string,
  end: string,
  isCurrent: boolean
): StreakRecord {
  return { days, endDate: end, isCurrent, startDate: start };
}

/**
 * Calculate all streak records from tracking data
 */
export function calculateStreakRecords(
  tracking: HabitTrackingEntry[],
  currentStreak: number
): StreakRecord[] {
  if (tracking.length === 0) return [];

  const completedDates = tracking
    .filter((t) => t.completed)
    .map((t) => t.date)
    .sort();
  if (completedDates.length === 0) return [];

  const streaks: StreakRecord[] = [];
  let streakStart = completedDates[0];
  let streakDays = 1;
  let prevDateStr = completedDates[0];

  for (let i = 1; i < completedDates.length; i++) {
    const currDateStr = completedDates[i];
    const diffDays = differenceInDays(currDateStr, prevDateStr);

    if (diffDays === 1) {
      streakDays++;
    } else if (diffDays > 1) {
      if (streakDays >= MIN_STREAK_DAYS) {
        streaks.push(createRecord(streakDays, streakStart, prevDateStr, false));
      }
      streakStart = currDateStr;
      streakDays = 1;
    }
    prevDateStr = currDateStr;
  }

  // Handle final streak
  if (streakDays >= MIN_STREAK_DAYS) {
    const today = getTodayString();
    const lastDate = completedDates.at(-1) ?? prevDateStr;
    const daysSince = differenceInDays(today, lastDate);
    const isCurrent = daysSince <= 1 && currentStreak > 0;
    streaks.push(createRecord(streakDays, streakStart, lastDate, isCurrent));
  }

  streaks.sort((a, b) => b.days - a.days);

  // Add current streak if not captured
  if (currentStreak >= MIN_STREAK_DAYS && !streaks.some((s) => s.isCurrent)) {
    const today = getTodayString();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - currentStreak + 1);
    streaks.push(
      createRecord(currentStreak, formatDateString(startDate), today, true)
    );
    streaks.sort((a, b) => b.days - a.days);
  }

  return streaks.slice(0, MAX_STREAK_RECORDS_DISPLAY);
}
