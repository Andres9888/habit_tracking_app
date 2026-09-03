/** Month-level derivations for the History surface, memoised in one place. */

import { useMemo } from 'react';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import {
  bestMonth,
  buildMonthlyRates,
  monthRangeLabel,
  parseLocalDate,
  trendCaption,
  type MonthRate,
} from '../../insights';

interface UseHistoryMonthsArgs {
  completedDates: Set<string>;
  /** Clamps the rates so months before the habit existed score nothing. */
  createdAt?: number;
  daysOfWeek?: number[];
  /** Today as YYYY-MM-DD; injectable for tests. */
  today?: string;
}

export interface HistoryMonths {
  year: number;
  rates: MonthRate[];
  rangeLabel: string;
  caption: string | null;
  best: MonthRate | null;
  /** Last month that has fully elapsed — null in January. */
  lastComplete: MonthRate | null;
}

export function useHistoryMonths({
  completedDates,
  createdAt,
  daysOfWeek,
  today = getLocalDateString(),
}: UseHistoryMonthsArgs): HistoryMonths {
  return useMemo(() => {
    const rates = buildMonthlyRates({
      completedDates,
      createdAt,
      daysOfWeek,
      today,
    });
    return {
      best: bestMonth(rates),
      caption: trendCaption(rates),
      lastComplete: rates.length > 1 ? (rates[rates.length - 2] ?? null) : null,
      rangeLabel: monthRangeLabel(rates),
      rates,
      year: parseLocalDate(today).getFullYear(),
    };
  }, [completedDates, createdAt, daysOfWeek, today]);
}
