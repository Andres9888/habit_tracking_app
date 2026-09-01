import { useMemo } from 'react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useCachedQuery } from '../../../lib/queryCache';

interface HabitTrackingRangeArgs {
  enabled?: boolean;
  endDate: string;
  habitId?: Id<'habits'>;
  startDate: string;
}

/** Fetch one habit's exact tracking range without imposing analysis limits. */
export function useHabitTrackingRange({
  enabled = true,
  endDate,
  habitId,
  startDate,
}: HabitTrackingRangeArgs) {
  const args = useMemo(
    () =>
      enabled && habitId ? { endDate, habitId, startDate } : ('skip' as const),
    [enabled, endDate, habitId, startDate]
  );

  return useCachedQuery(api.habits.getHabitTracking, args, {
    entryName: 'habits.getHabitTracking',
    fallbackToLatest: false,
  });
}
