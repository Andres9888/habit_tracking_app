/**
 * Frequency-Aware Streak Calculation
 *
 * Calculates streaks for habits with different frequency modes:
 * - Daily: Consecutive days (existing logic)
 * - Weekly: X times per week streaks
 * - Days: Streaks on specific days
 * - Interval: Streaks on every X days
 */

import { startOfDay, addDays } from 'date-fns';
import type { FrequencyConfig } from './frequency';
import { parseFrequencyConfig, isHabitScheduledForDate } from './frequency';
import type { HabitTrackingRecord } from '../habitStrength/types';

/**
 * Result of streak calculation
 */
export interface StreakResult {
  currentStreak: number;
  bestStreak: number;
  consecutiveDays: number;
  lastCompletedDate?: string;
}

/**
 * Calculate streak for a habit based on its frequency configuration
 */
export function calculateFrequencyStreak(params: {
  habitFrequencyConfig?: string;
  tracking: HabitTrackingRecord[];
  currentBestStreak?: number;
  evaluationDate?: Date;
}): StreakResult {
  const { habitFrequencyConfig, tracking, currentBestStreak = 0, evaluationDate } = params;

  // Parse frequency config, default to daily
  const frequencyConfig = habitFrequencyConfig
    ? parseFrequencyConfig(habitFrequencyConfig)
    : { type: 'daily' as const };

  const evalDate = evaluationDate ? startOfDay(evaluationDate) : startOfDay(new Date());

  // Build a map of completed dates
  const completedDates = new Set(
    tracking.filter((r) => r.completed).map((r) => r.date)
  );

  switch (frequencyConfig.type) {
    case 'daily':
      return calculateDailyStreak(completedDates, evalDate, currentBestStreak);

    case 'weekly':
      return calculateWeeklyStreak(
        completedDates,
        evalDate,
        frequencyConfig.timesPerWeek || 3,
        currentBestStreak
      );

    case 'days':
      return calculateDaysStreak(
        completedDates,
        evalDate,
        frequencyConfig.daysOfWeek || [],
        currentBestStreak
      );

    case 'interval':
      return calculateIntervalStreak(
        completedDates,
        evalDate,
        frequencyConfig.intervalDays || 7,
        currentBestStreak
      );

    default:
      return calculateDailyStreak(completedDates, evalDate, currentBestStreak);
  }
}

/**
 * Calculate daily streak (consecutive days)
 */
function calculateDailyStreak(
  completedDates: Set<string>,
  evalDate: Date,
  currentBestStreak: number
): StreakResult {
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  let currentStreak = 0;
  let consecutiveDays = 0;

  // Walk backwards from evalDate
  for (
    let cursor = new Date(evalDate);
    cursor.getTime() >= evalDate.getTime() - 365 * 24 * 60 * 60 * 1000;
    cursor = addDays(cursor, -1)
  ) {
    const dateStr = formatDate(cursor);

    if (completedDates.has(dateStr)) {
      consecutiveDays++;
      // For current streak, we track from today going back
      if (cursor.getTime() === evalDate.getTime() ||
          (currentStreak > 0 && formatDate(addDays(cursor, 1)) in completedDates)) {
        currentStreak = consecutiveDays;
      }
    } else {
      // Only break streak if this is not today (today can still be completed)
      if (cursor.getTime() !== evalDate.getTime()) {
        consecutiveDays = 0;
      }
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(currentBestStreak, currentStreak),
    consecutiveDays,
  };
}

/**
 * Calculate weekly streak (X times per week for consecutive weeks)
 */
function calculateWeeklyStreak(
  completedDates: Set<string>,
  evalDate: Date,
  timesPerWeek: number,
  currentBestStreak: number
): StreakResult {
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  // Get week start (Sunday) for each week
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return startOfDay(d);
  };

  let currentStreak = 0;
  let bestStreak = currentBestStreak;

  // Evaluate weeks going back
  for (let weekOffset = 0; weekOffset < 52; weekOffset++) {
    const weekStart = addDays(getWeekStart(evalDate), -weekOffset * 7);
    const weekEnd = addDays(weekStart, 6);

    // Count completions in this week
    let weekCompletions = 0;
    for (
      let dayCursor = new Date(weekStart);
      dayCursor.getTime() <= weekEnd.getTime();
      dayCursor = addDays(dayCursor, 1)
    ) {
      if (completedDates.has(formatDate(dayCursor))) {
        weekCompletions++;
      }
    }

    if (weekCompletions >= timesPerWeek) {
      if (weekOffset === 0) {
        currentStreak++;
      }
    } else {
      // Break streak if we haven't met the requirement
      break;
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    consecutiveDays: 0, // Not applicable for weekly
    lastCompletedDate: undefined,
  };
}

/**
 * Calculate streak for specific days of week
 */
function calculateDaysStreak(
  completedDates: Set<string>,
  evalDate: Date,
  daysOfWeek: number[],
  currentBestStreak: number
): StreakResult {
  if (daysOfWeek.length === 0) {
    return calculateDailyStreak(completedDates, evalDate, currentBestStreak);
  }

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const daysSet = new Set(daysOfWeek);

  let currentStreak = 0;
  let bestStreak = currentBestStreak;

  // Walk backwards, checking only the scheduled days
  for (
    let cursor = new Date(evalDate);
    cursor.getTime() >= evalDate.getTime() - 365 * 24 * 60 * 60 * 1000;
    cursor = addDays(cursor, -1)
  ) {
    const dayOfWeek = cursor.getDay();

    if (daysSet.has(dayOfWeek)) {
      const dateStr = formatDate(cursor);
      if (completedDates.has(dateStr)) {
        if (currentStreak === 0 && cursor.getTime() !== evalDate.getTime()) {
          // This is a past scheduled day, count towards streak
        }
        currentStreak++;
      } else {
        // Missed a scheduled day
        if (cursor.getTime() !== evalDate.getTime()) {
          break;
        }
      }
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    consecutiveDays: 0,
  };
}

/**
 * Calculate streak for interval-based habits
 */
function calculateIntervalStreak(
  completedDates: Set<string>,
  evalDate: Date,
  intervalDays: number,
  currentBestStreak: number
): StreakResult {
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  let currentStreak = 0;
  let bestStreak = currentBestStreak;

  // Walk backwards in intervals
  for (let offset = 0; offset < 52; offset++) {
    const scheduledDate = addDays(evalDate, -offset * intervalDays);
    const dateStr = formatDate(scheduledDate);

    // Check if this scheduled day was completed (or within a reasonable window)
    let foundCompletion = false;
    for (let windowOffset = -1; windowOffset <= 1; windowOffset++) {
      const windowDate = formatDate(addDays(scheduledDate, windowOffset));
      if (completedDates.has(windowDate)) {
        foundCompletion = true;
        break;
      }
    }

    if (foundCompletion) {
      currentStreak++;
    } else {
      // Missed an interval
      if (offset > 0) {
        break;
      }
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    consecutiveDays: 0,
  };
}
