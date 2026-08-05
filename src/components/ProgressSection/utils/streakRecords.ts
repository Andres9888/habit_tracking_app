/**
 * Streak records calculation
 */

import type { HabitTrackingEntry } from '../../../features/habits/types';
import type { StreakRecord } from '../types';
import {
  differenceInDays,
  getTodayString,
  formatDateString,
} from '../../../utils/dateUtils';

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
      if (streakDays >= 2) {
        streaks.push({
          days: streakDays,
          endDate: prevDateStr,
          isCurrent: false,
          startDate: streakStart,
        });
      }
      streakStart = currDateStr;
      streakDays = 1;
    }
    prevDateStr = currDateStr;
  }

  return finalizeStreakRecords(
    streaks,
    completedDates,
    streakStart,
    streakDays,
    currentStreak
  );
}

function finalizeStreakRecords(
  streaks: StreakRecord[],
  completedDates: string[],
  streakStart: string,
  streakDays: number,
  currentStreak: number
): StreakRecord[] {
  if (streakDays >= 2) {
    const today = getTodayString();
    const lastDate = completedDates.at(-1) ?? today;
    const daysSinceLastCompletion = differenceInDays(today, lastDate);
    const isCurrent = daysSinceLastCompletion <= 1;
    streaks.push({
      days: streakDays,
      endDate: lastDate,
      isCurrent: isCurrent && currentStreak > 0,
      startDate: streakStart,
    });
  }

  streaks.sort((a, b) => b.days - a.days);

  if (currentStreak > 0) {
    const currentIdx = streaks.findIndex((s) => s.isCurrent);
    if (currentIdx === -1 && currentStreak >= 2) {
      const today = getTodayString();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - currentStreak + 1);
      streaks.push({
        days: currentStreak,
        endDate: today,
        isCurrent: true,
        startDate: formatDateString(startDate),
      });
      streaks.sort((a, b) => b.days - a.days);
    }
  }

  return streaks.slice(0, 5);
}
