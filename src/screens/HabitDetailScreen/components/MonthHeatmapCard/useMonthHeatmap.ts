/**
 * Rolling four-week heatmap window ending today, Monday-first.
 *
 * Deliberately a rolling 28 days rather than a calendar month: the design's
 * grid is always exactly four full weeks ("June 23 – July 20"), which keeps the
 * cell size and row count stable regardless of month length.
 */

import { useMemo } from 'react';
import { addDays, format, startOfWeek } from 'date-fns';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { isScheduledWeekday, scheduledWeekdays } from '../../insights';

export type HeatCellState = 'done' | 'partial' | 'missed' | 'today' | 'future';

export interface HeatCell {
  date: string;
  state: HeatCellState;
}

const WEEKS = 4;

interface UseMonthHeatmapArgs {
  completedDates: Set<string>;
  daysOfWeek?: number[];
  /** Days the habit was paused — shown as skipped, not missed. */
  pausedDates?: Set<string>;
  today?: string;
}

export function useMonthHeatmap({
  completedDates,
  daysOfWeek,
  pausedDates,
  today = getLocalDateString(),
}: UseMonthHeatmapArgs) {
  return useMemo(() => {
    const scheduled = scheduledWeekdays({ daysOfWeek });
    const endOfThisWeek = addDays(
      startOfWeek(new Date(`${today}T00:00:00`), { weekStartsOn: 1 }),
      6
    );
    const start = addDays(endOfThisWeek, -(WEEKS * 7 - 1));

    const cells: HeatCell[] = Array.from({ length: WEEKS * 7 }, (_, index) => {
      const cursor = addDays(start, index);
      const date = getLocalDateString(cursor);
      if (completedDates.has(date)) return { date, state: 'done' as const };
      if (date === today) return { date, state: 'today' as const };
      if (date > today) return { date, state: 'future' as const };
      if (
        pausedDates?.has(date) ||
        !isScheduledWeekday(scheduled, cursor.getDay())
      ) {
        return { date, state: 'partial' as const };
      }
      return { date, state: 'missed' as const };
    });

    return {
      cells,
      rangeLabel: `${format(start, 'MMM d')} – ${format(endOfThisWeek, 'MMM d')}`,
    };
  }, [completedDates, daysOfWeek, pausedDates, today]);
}
