/**
 * useWeeklyPatternData — computes best/worst days and accessibility summary.
 */

import { useMemo } from 'react';
import { findBestDay, findWorstDay } from './WeeklyPatternChart.helpers';

interface DayStat {
  day: string;
  dayIndex: number;
  rate: number;
  total: number;
}

export function useWeeklyPatternData(dayStats: DayStat[]) {
  const { bestDayIndex, worstDayIndex, maxRate } = useMemo(() => {
    const withData = dayStats.filter((d) => d.total > 0);

    if (withData.length === 0) {
      return { bestDayIndex: -1, maxRate: 1, worstDayIndex: -1 };
    }

    const best = findBestDay(withData);
    const worst = findWorstDay(withData);
    const max = Math.max(...dayStats.map((d) => d.rate), 1);

    const worstIdx =
      best && worst && worst.dayIndex !== best.dayIndex && worst.rate < 70
        ? worst.dayIndex
        : -1;

    return {
      bestDayIndex: best?.dayIndex ?? -1,
      maxRate: max,
      worstDayIndex: worstIdx,
    };
  }, [dayStats]);

  const accessibilitySummary = useMemo(() => {
    const bestDay = dayStats.find((d) => d.dayIndex === bestDayIndex);
    const worstDay = dayStats.find((d) => d.dayIndex === worstDayIndex);

    let summary = 'Weekly pattern chart.';
    if (bestDay) {
      summary += ` Best day: ${bestDay.day} at ${bestDay.rate}%.`;
    }
    if (worstDay) {
      summary += ` Focus day: ${worstDay.day} at ${worstDay.rate}%.`;
    }
    return summary;
  }, [dayStats, bestDayIndex, worstDayIndex]);

  return { bestDayIndex, worstDayIndex, maxRate, accessibilitySummary };
}
