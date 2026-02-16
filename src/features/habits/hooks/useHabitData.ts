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

  // Build query args unconditionally to avoid conditional hook calls (React rules)
  const trackingArgs = startDate && endDate
    ? { endDate, startDate }
    : { dates: safeDateStrings };

  const trackingQuery = useQuery(api.habits.getTracking, trackingArgs);

  // Guard: When Convex is unreachable, trackingQuery will be undefined
  const tracking = Array.isArray(trackingQuery) ? trackingQuery : [];

  return { habits, isHabitsLoading, settings, tracking };
}
