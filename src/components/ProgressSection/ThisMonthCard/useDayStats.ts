/**
 * useDayStats Hook
 * Calculate best and worst days from day statistics
 */

import { useMemo } from 'react';
import type { DayStats } from '../types';

interface DayStatsResult {
  bestDay: DayStats | null;
  worstDay: DayStats | null;
  maxRate: number;
}

export function useDayStats(dayStats: DayStats[]): DayStatsResult {
  return useMemo(() => {
    const withData = dayStats.filter((d) => d.total > 0);
    if (withData.length === 0) {
      return { bestDay: null, maxRate: 1, worstDay: null };
    }

    // Find best and worst days using loops (eslint: unicorn/no-array-reduce)
    let best = withData[0];
    let worst = withData[0];
    for (const day of withData) {
      if (day.rate > best.rate) best = day;
      if (day.rate < worst.rate) worst = day;
    }

    const max = Math.max(...dayStats.map((d) => d.rate), 1);

    return { bestDay: best, maxRate: max, worstDay: worst };
  }, [dayStats]);
}
