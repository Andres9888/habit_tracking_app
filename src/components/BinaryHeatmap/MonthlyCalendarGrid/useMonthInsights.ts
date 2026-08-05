/**
 * useMonthInsights Hook
 *
 * Derives the summary stats shown in the MonthInsightStrip:
 * current streak, all-time best run, strongest weekday, and the
 * completion rate for the month currently in view.
 *
 * Streak math is delegated to the shared utilities so the numbers stay
 * consistent with the rest of the app — we do not re-implement it here.
 */

import { useMemo } from 'react';
import {
  parseISO,
  getDay,
  format,
  startOfMonth,
  endOfMonth,
  isAfter,
  startOfToday,
} from 'date-fns';
import { computeCurrentStreakFromDates } from '@/utils/streak';
import { calculateBestStreakFromDates } from '@/lib/offline/calculations/streakFromDates';

// getDay() returns 0=Sun..6=Sat
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface MonthInsights {
  currentStreak: number;
  bestRun: number;
  strongestDay: string;
  monthRate: number;
}

export function useMonthInsights(
  completedDates: Set<string>,
  currentMonth: Date
): MonthInsights {
  return useMemo(() => {
    const today = startOfToday();
    const currentStreak = computeCurrentStreakFromDates(completedDates, today);
    const bestRun = calculateBestStreakFromDates([...completedDates]);

    // Strongest weekday (all-time) — most-completed day of week.
    const counts = [0, 0, 0, 0, 0, 0, 0];
    for (const date of completedDates) {
      const parsed = parseISO(date);
      if (!Number.isNaN(parsed.getTime())) counts[getDay(parsed)] += 1;
    }
    let best = 0;
    for (const [i, v] of counts.entries()) {
      if (v > counts[best]) best = i;
    }
    const strongestDay = counts[best] > 0 ? WEEKDAY_LABELS[best] : '—';

    // Completion rate for the visible month, counting only elapsed days.
    let elapsed = 0;
    let done = 0;
    const cursor = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    while (cursor <= monthEnd) {
      if (isAfter(cursor, today)) break;
      elapsed += 1;
      if (completedDates.has(format(cursor, 'yyyy-MM-dd'))) done += 1;
      cursor.setDate(cursor.getDate() + 1);
    }
    const monthRate = elapsed > 0 ? Math.round((done / elapsed) * 100) : 0;

    return { currentStreak, bestRun, strongestDay, monthRate };
  }, [completedDates, currentMonth]);
}
