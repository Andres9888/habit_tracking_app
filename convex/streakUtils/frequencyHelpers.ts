/**
 * Frequency-aware streak calculation helpers.
 *
 * Supports: daily, specific_days, times_per_week, every_x_days.
 * A "streak" counts consecutive *expected* periods where the user met their target.
 */

import { differenceInDays } from './dateHelpers';
import type { StreakData, TrackingRecord } from './types';

/** Frequency configuration for a habit */
export interface FrequencyConfig {
  /** "daily" | "specific_days" | "times_per_week" | "every_x_days" */
  frequency: string;
  /** Days of week for specific_days (0=Sun, 6=Sat) */
  daysOfWeek?: number[];
  /** Target completions per week for times_per_week */
  timesPerWeek?: number;
  /** Interval in days for every_x_days */
  everyXDays?: number;
}

/**
 * Get the day-of-week (0=Sun..6=Sat) for a YYYY-MM-DD string.
 */
function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDay();
}

/**
 * Check whether a given date is a "scheduled" day for the habit.
 */
export function isScheduledDay(
  dateStr: string,
  config: FrequencyConfig,
  habitCreatedDate?: string
): boolean {
  const freq = config.frequency || 'daily';

  if (freq === 'daily') return true;

  if (freq === 'specific_days' && config.daysOfWeek?.length) {
    return config.daysOfWeek.includes(getDayOfWeek(dateStr));
  }

  if (freq === 'every_x_days' && config.everyXDays && config.everyXDays > 0 && habitCreatedDate) {
    const created = new Date(habitCreatedDate + 'T00:00:00');
    const current = new Date(dateStr + 'T00:00:00');
    const daysSinceCreation = differenceInDays(current, created);
    return daysSinceCreation >= 0 && daysSinceCreation % config.everyXDays === 0;
  }

  // times_per_week: every day is potentially valid; streak is week-based
  if (freq === 'times_per_week') return true;

  return true; // fallback: treat as daily
}

/**
 * Calculate frequency-aware streak from tracking history.
 *
 * For daily / specific_days / every_x_days:
 *   Counts consecutive scheduled days completed, walking backwards from today.
 *
 * For times_per_week:
 *   Counts consecutive weeks where the user hit their target.
 */
export function calculateFrequencyAwareStreak(
  tracking: TrackingRecord[],
  todayDate: string,
  config: FrequencyConfig,
  habitCreatedDate?: string
): StreakData {
  const completedSet = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  if (completedSet.size === 0) {
    return { bestStreak: 0, currentStreak: 0, lastCompletedDate: '' };
  }

  const sortedCompleted = [...completedSet].sort((a, b) => b.localeCompare(a));
  const lastCompletedDate = sortedCompleted[0];

  if (config.frequency === 'times_per_week') {
    return calculateWeeklyStreak(completedSet, todayDate, config.timesPerWeek ?? 1);
  }

  // For daily / specific_days / every_x_days: walk backwards through scheduled days
  const createdStr = habitCreatedDate
    ? new Date(habitCreatedDate).toISOString().slice(0, 10)
    : undefined;

  let currentStreak = 0;
  let bestStreak = 0;
  let runStreak = 0;
  let cursor = new Date(todayDate + 'T00:00:00');
  const earliest = createdStr
    ? new Date(createdStr + 'T00:00:00')
    : new Date(sortedCompleted[sortedCompleted.length - 1] + 'T00:00:00');

  // Allow a 1-day grace for current streak (today might not be done yet)
  let graceUsed = false;
  let isCurrentRun = true;

  // Walk backwards up to 1000 days
  for (let i = 0; i < 1000; i++) {
    const dateStr = cursor.toISOString().slice(0, 10);

    if (cursor < earliest) break;

    const scheduled = isScheduledDay(dateStr, config, createdStr);

    if (scheduled) {
      if (completedSet.has(dateStr)) {
        runStreak++;
      } else if (isCurrentRun && !graceUsed && dateStr === todayDate) {
        // Grace: today not yet completed, don't break streak
        graceUsed = true;
      } else {
        // Streak broken
        if (isCurrentRun) {
          currentStreak = runStreak;
          isCurrentRun = false;
        }
        bestStreak = Math.max(bestStreak, runStreak);
        runStreak = 0;
      }
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  if (isCurrentRun) currentStreak = runStreak;
  bestStreak = Math.max(bestStreak, runStreak, currentStreak);

  return { bestStreak, currentStreak, lastCompletedDate };
}

/**
 * Week-based streak for "X times per week" frequency.
 */
function calculateWeeklyStreak(
  completedSet: Set<string>,
  todayDate: string,
  target: number
): StreakData {
  const sortedCompleted = [...completedSet].sort((a, b) => b.localeCompare(a));
  const lastCompletedDate = sortedCompleted[0];

  // Get start of current week (Monday)
  const today = new Date(todayDate + 'T00:00:00');
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);

  let currentStreak = 0;
  let bestStreak = 0;
  let runStreak = 0;
  let isCurrentRun = true;

  // Walk backwards week by week, up to 52 weeks
  for (let w = 0; w < 52; w++) {
    const ws = new Date(weekStart);
    ws.setDate(weekStart.getDate() - w * 7);

    let count = 0;
    for (let d = 0; d < 7; d++) {
      const day = new Date(ws);
      day.setDate(ws.getDate() + d);
      const dateStr = day.toISOString().slice(0, 10);
      if (completedSet.has(dateStr)) count++;
    }

    // Current week (w=0) gets grace: partial week
    if (w === 0) {
      // Don't break streak on current incomplete week
      if (count >= target) {
        runStreak++;
      }
      // Just skip if not met yet this week
      continue;
    }

    if (count >= target) {
      runStreak++;
    } else {
      if (isCurrentRun) {
        currentStreak = runStreak;
        isCurrentRun = false;
      }
      bestStreak = Math.max(bestStreak, runStreak);
      runStreak = 0;
    }
  }

  if (isCurrentRun) currentStreak = runStreak;
  bestStreak = Math.max(bestStreak, runStreak, currentStreak);

  return { bestStreak, currentStreak, lastCompletedDate };
}
