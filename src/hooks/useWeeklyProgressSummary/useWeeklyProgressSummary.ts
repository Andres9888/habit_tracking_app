/**
 * useWeeklyProgressSummary Hook
 *
 * Computes weekly progress data and generates notification-ready content.
 * This hook prepares the data/copy — actual notification scheduling
 * is handled by the notification system.
 */

import { useMemo } from 'react';
import type { HabitWeekData, WeeklyProgressData } from './types';
import {
  generateNotificationTitle,
  generateNotificationBody,
  generateShortSummary,
} from './copyGenerator';

const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function useWeeklyProgressSummary(
  habitsData: HabitWeekData[]
): WeeklyProgressData {
  return useMemo(() => {
    if (habitsData.length === 0) {
      return {
        totalCompleted: 0,
        totalPossible: 0,
        completionRate: 0,
        perfectDays: 0,
        longestStreak: 0,
        habitsImproved: 0,
        bestDay: null,
        notificationTitle: '',
        notificationBody: '',
        shortSummary: '',
        isReady: false,
      };
    }

    const numDays = 7;
    const numHabits = habitsData.length;

    // Calculate totals
    let totalCompleted = 0;
    const dailyTotals: number[] = Array(numDays).fill(0);

    for (const habit of habitsData) {
      for (let d = 0; d < numDays; d++) {
        const val = habit.dailyCompletions[d] ?? 0;
        totalCompleted += val;
        dailyTotals[d] += val;
      }
    }

    const totalPossible = numHabits * numDays;
    const completionRate =
      totalPossible > 0
        ? Math.round((totalCompleted / totalPossible) * 100)
        : 0;

    // Perfect days
    const perfectDays = dailyTotals.filter((t) => t === numHabits).length;

    // Best day
    let bestDayIdx = 0;
    let bestDayTotal = 0;
    for (let d = 0; d < numDays; d++) {
      if (dailyTotals[d] > bestDayTotal) {
        bestDayTotal = dailyTotals[d];
        bestDayIdx = d;
      }
    }
    const bestDay =
      bestDayTotal > 0
        ? {
            dayName: DAY_NAMES[bestDayIdx],
            completionRate: Math.round((bestDayTotal / numHabits) * 100),
          }
        : null;

    // Longest streak
    const longestStreak = Math.max(
      ...habitsData.map((h) => h.currentStreak),
      0
    );

    // Habits improved vs previous week
    const habitsImproved = habitsData.filter((h) => {
      if (h.previousWeekCompletions === undefined) return false;
      const thisWeek = h.dailyCompletions.reduce((a, b) => a + b, 0);
      return thisWeek > h.previousWeekCompletions;
    }).length;

    const notificationTitle = generateNotificationTitle(
      completionRate,
      perfectDays
    );
    const notificationBody = generateNotificationBody({
      completionRate,
      totalCompleted,
      totalPossible,
      perfectDays,
      longestStreak,
      habitsImproved,
      bestDay,
    });
    const shortSummary = generateShortSummary(completionRate, totalCompleted);

    return {
      totalCompleted,
      totalPossible,
      completionRate,
      perfectDays,
      longestStreak,
      habitsImproved,
      bestDay,
      notificationTitle,
      notificationBody,
      shortSummary,
      isReady: true,
    };
  }, [habitsData]);
}
