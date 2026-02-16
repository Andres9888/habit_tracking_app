import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';


export function useHabitData(extendedDateStrings: string[]) {
  // Guard against empty or invalid date strings array
  const safeDateStrings =
    Array.isArray(extendedDateStrings) && extendedDateStrings.length > 0
      ? extendedDateStrings
      : [];

  const habitsQuery = useQuery(api.habits.list);
  // Guard: When Convex is unreachable, habitsQuery will be undefined
  // Return empty array as safe fallback
  const habits = Array.isArray(habitsQuery) ? habitsQuery : [];
  const isHabitsLoading = habitsQuery === undefined;

  const settings = useQuery(api.settings.get);

  // Use startDate/endDate range to reduce query arg payload (~4KB → ~50 bytes)
  const startDate = safeDateStrings[0];
  const endDate = safeDateStrings.at(-1);

  // Guard: Skip tracking query if no valid date range
  const trackingQuery =
    startDate && endDate
      ? useQuery(api.habits.getTracking, { endDate, startDate })
      : useQuery(api.habits.getTracking, { dates: safeDateStrings });

  // Guard: When Convex is unreachable, trackingQuery will be undefined
  const tracking = Array.isArray(trackingQuery) ? trackingQuery : [];

  return { habits, isHabitsLoading, settings, tracking };
}
