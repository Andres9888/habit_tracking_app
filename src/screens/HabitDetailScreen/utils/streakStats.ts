/**
 * Streak statistics utilities for habit detail screen
 * Computes best streak, completion rate, and weekly trend
 */
import { format, subDays, parseISO } from 'date-fns';

/**
 * Compute the best (longest) streak from a set of completed dates.
 */
export function computeBestStreak(completedDates: Set<string>): number {
  if (completedDates.size === 0) return 0;

  const sorted = [...completedDates].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = parseISO(sorted[i - 1]);
    const curr = parseISO(sorted[i]);
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      current += 1;
      if (current > best) best = current;
    } else if (diffDays > 1) {
      current = 1;
    }
    // diffDays === 0 means duplicate date, skip
  }

  return best;
}

/**
 * Compute completion rate for a given period (last N days).
 * Returns a value between 0 and 1.
 */
export function computeCompletionRate(
  completedDates: Set<string>,
  days: number,
  referenceDate: Date = new Date()
): number {
  if (days <= 0) return 0;

  let completed = 0;
  for (let i = 0; i < days; i++) {
    const dateStr = format(subDays(referenceDate, i), 'yyyy-MM-dd');
    if (completedDates.has(dateStr)) completed += 1;
  }

  return completed / days;
}

export type TrendDirection = 'up' | 'down' | 'flat';

export interface CompletionTrend {
  /** Current week completion rate (0-1) */
  currentRate: number;
  /** Previous week completion rate (0-1) */
  previousRate: number;
  /** Direction of trend */
  direction: TrendDirection;
  /** Absolute difference in percentage points */
  delta: number;
}

/**
 * Compute completion rate trend: this week vs last week.
 */
export function computeCompletionTrend(
  completedDates: Set<string>,
  referenceDate: Date = new Date()
): CompletionTrend {
  const currentRate = computeCompletionRate(completedDates, 7, referenceDate);
  const previousRate = computeCompletionRate(
    completedDates,
    7,
    subDays(referenceDate, 7)
  );

  const delta = Math.abs(currentRate - previousRate);
  let direction: TrendDirection = 'flat';
  if (currentRate > previousRate + 0.01) direction = 'up';
  else if (currentRate < previousRate - 0.01) direction = 'down';

  return { currentRate, previousRate, direction, delta };
}
