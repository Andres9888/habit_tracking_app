/**
 * useMonthInsights Hook
 *
 * Derives the summary shown in the MonthInsightStrip: the strongest weekday
 * (all-time) and the completion rate for the month currently in view.
 *
 * Streak and best-run numbers intentionally live in the hero, not here — the
 * strip only carries stats the day grid alone can produce.
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

// getDay() returns 0=Sun..6=Sat
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface MonthInsights {
  strongestDay: string;
  monthRate: number;
}

export function useMonthInsights(
  completedDates: Set<string>,
  currentMonth: Date
): MonthInsights {
  return useMemo(() => {
    const today = startOfToday();

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

    return { strongestDay, monthRate };
  }, [completedDates, currentMonth]);
}
