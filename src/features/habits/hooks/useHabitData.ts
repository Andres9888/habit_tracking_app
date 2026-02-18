import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useFrequentQuery, useMediumQuery } from '../../../../hooks/useQueryWithCache';


export function useHabitData(extendedDateStrings: string[]) {
  // Guard against empty or invalid date strings array
  const safeDateStrings =
    Array.isArray(extendedDateStrings) && extendedDateStrings.length > 0
      ? extendedDateStrings
      : [];

  // Habits list - moderate change frequency (1 min cache)
  const habitsQuery = useMediumQuery(api.habits.list, undefined, 'habits-list');
  
  // Guard: When Convex is unreachable, habitsQuery will be undefined
  // Return empty array as safe fallback
  const habits = Array.isArray(habitsQuery) ? habitsQuery : [];
  const isHabitsLoading = habitsQuery === undefined;

  // Settings - moderate change frequency (1 min cache)
  const settings = useMediumQuery(api.settings.get, undefined, 'settings');

  // Use startDate/endDate range to reduce query arg payload (~4KB → ~50 bytes)
  const startDate = safeDateStrings[0];
  const endDate = safeDateStrings.at(-1);

  // Tracking - SHORT cache (30s) since it changes frequently throughout the day
  const trackingQuery =
    startDate && endDate
      ? useFrequentQuery(api.habits.getTracking, { endDate, startDate }, 'tracking-range')
      : useFrequentQuery(api.habits.getTracking, { dates: safeDateStrings }, 'tracking-dates');

  // Guard: When Convex is unreachable, trackingQuery will be undefined
  const tracking = Array.isArray(trackingQuery) ? trackingQuery : [];

  return { habits, isHabitsLoading, settings, tracking };
}
