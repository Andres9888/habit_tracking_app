import { api } from '../../../../convex/_generated/api';
import { useCachedQuery } from '../../../lib/queryCache';

export function useHabitData(extendedDateStrings: string[]) {
  // Guard against empty or invalid date strings array
  const safeDateStrings =
    Array.isArray(extendedDateStrings) && extendedDateStrings.length > 0
      ? extendedDateStrings
      : [];

  const habitsQuery = useCachedQuery(
    api.habits.list,
    {},
    {
      entryName: 'habits.list',
    }
  );
  // Guard: When Convex is unreachable, habitsQuery will be undefined
  // Return empty array as safe fallback
  const habits = Array.isArray(habitsQuery) ? habitsQuery : [];
  const isHabitsLoading = habitsQuery === undefined;

  const settings = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );

  // Use startDate/endDate range to reduce query arg payload (~4KB → ~50 bytes)
  const startDate = safeDateStrings[0];
  const endDate = safeDateStrings.at(-1);

  // Guard: Skip tracking query if no valid date range
  const trackingQuery = useCachedQuery(
    api.habits.getTracking,
    startDate && endDate ? { endDate, startDate } : { dates: safeDateStrings },
    { entryName: 'habits.getTracking', fallbackToLatest: false }
  );

  // Guard: When Convex is unreachable, trackingQuery will be undefined
  const tracking = Array.isArray(trackingQuery) ? trackingQuery : [];

  return { habits, isHabitsLoading, settings, tracking };
}
