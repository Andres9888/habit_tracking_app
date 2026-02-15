
import { useMemo } from 'react';

import type { DayStats, WeeklySummaryStats } from './types';

/**
 * Calculate weekly summary statistics from day stats
 */
export function useWeeklySummaryStats(
  weekStats: DayStats[]
): WeeklySummaryStats {
  return useMemo(() => {
    const totalCompleted = weekStats.reduce(
      (sum, day) => sum + day.completed,
      0
    );
    const totalPossible = weekStats.reduce((sum, day) => sum + day.total, 0);
    const completionRate =
      totalPossible > 0
        ? Math.round((totalCompleted / totalPossible) * 100)
        : 0;

    // Find best day
    let bestDay: DayStats | null = null;
    let bestDayRate = 0;
    for (const day of weekStats) {
      const rate = day.total > 0 ? day.completed / day.total : 0;
      if (rate > bestDayRate) {
        bestDayRate = rate;
        bestDay = day;
      }
    }

    // Count perfect days (100% completion)
    const perfectDays = weekStats.filter(
      (day) => day.total > 0 && day.completed === day.total
    ).length;

    // Calculate streak of consecutive perfect days
    let consecutivePerfectDays = 0;
    for (const day of weekStats) {
      if (day.total > 0 && day.completed === day.total) {
        consecutivePerfectDays++;
      } else if (consecutivePerfectDays > 0) {
        break;
      }
    }

    return {
      bestDay,
      bestDayRate: Math.round(bestDayRate * 100),
      completionRate,
      consecutivePerfectDays,
      perfectDays,
      totalCompleted,
      totalPossible,
    };
  }, [weekStats]);
}
