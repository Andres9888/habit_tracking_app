/**
 * useHabitInsights — fetches this habit's rolling 400-day history and derives the
 * "What we're noticing" cards from it.
 *
 * Deliberately a separate query from the app-level `habits.getTracking` window:
 * that one is a short rolling buffer shared by every habit, while the insight
 * cards need a long, single-habit history.
 */

import { useMemo } from 'react';
import { subDays } from 'date-fns';
import type { Id } from '../../../../convex/_generated/dataModel';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { buildInsights } from './buildInsights';
import type { HabitInsights, InsightEntry } from './types';
import { useHabitTrackingRange } from './useHabitTrackingRange';

const EMPTY: HabitInsights = {
  daysOfData: 0,
  doneDates: new Set<string>(),
  oneFix: null,
  working: null,
  yearCompletions: 0,
  yearRatePct: 0,
};

interface UseHabitInsightsArgs {
  daysOfWeek?: number[];
  habitCreatedAt?: number;
  habitId?: Id<'habits'>;
  reminderTime?: string;
  /** Skip the query while the detail modal is closed. */
  enabled?: boolean;
}

export function useHabitInsights({
  daysOfWeek,
  enabled = true,
  habitCreatedAt,
  habitId,
  reminderTime,
}: UseHabitInsightsArgs): HabitInsights {
  const today = getLocalDateString();
  const startDate = useMemo(
    () => getLocalDateString(subDays(new Date(`${today}T00:00:00`), 400)),
    [today]
  );
  const rows = useHabitTrackingRange({
    enabled,
    endDate: today,
    habitId,
    startDate,
  });

  return useMemo(() => {
    if (!rows) return EMPTY;
    const entries: InsightEntry[] = rows.map((row) => ({
      completed: row.completed,
      createdAt: row._creationTime,
      date: row.date,
    }));
    return buildInsights({
      daysOfWeek,
      entries,
      habitCreatedAt,
      reminderTime,
      today,
    });
  }, [daysOfWeek, habitCreatedAt, reminderTime, rows, today]);
}
