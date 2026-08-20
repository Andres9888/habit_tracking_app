import { api } from '../../../../convex/_generated/api';
import { useCachedQuery } from '../../../lib/queryCache';
import { useSettingsQuery } from '../../../lib/settings/useSettingsQuery';

type TrackingQueryArgs = { endDate: string; startDate: string } | 'skip';

// Module-scoped so every "no data yet" return is the *same* array. Returning a
// fresh `[]` on each render meant consumers using `habits`/`tracking` as
// useMemo deps (e.g. CharacterScreen) re-ran their derivations on every render
// for as long as the query was loading or offline.
const EMPTY: never[] = [];

function getSafeDateStrings(extendedDateStrings: string[]) {
  return Array.isArray(extendedDateStrings) && extendedDateStrings.length > 0
    ? extendedDateStrings
    : EMPTY;
}

function buildTrackingQueryArgs(
  dateStrings: string[]
): TrackingQueryArgs {
  const firstDate = dateStrings[0];
  const lastDate = dateStrings.at(-1);
  if (!(firstDate && lastDate)) return 'skip';
  const ascending = firstDate <= lastDate;
  return ascending
    ? { endDate: lastDate, startDate: firstDate }
    : { endDate: firstDate, startDate: lastDate };
}

export function useHabitData(extendedDateStrings: string[]) {
  // Guard against empty or invalid date strings array
  const safeDateStrings = getSafeDateStrings(extendedDateStrings);

  const habitsQuery = useCachedQuery(
    api.habits.list,
    {},
    {
      entryName: 'habits.list',
    }
  );
  // Guard: When Convex is unreachable, habitsQuery will be undefined
  // Return empty array as safe fallback
  const habits = Array.isArray(habitsQuery) ? habitsQuery : EMPTY;
  const isHabitsLoading = habitsQuery === undefined;

  const settings = useSettingsQuery();

  // Use startDate/endDate range to reduce query arg payload (~4KB → ~50 bytes).
  // Callers pass date lists in either direction (CharacterScreen's is
  // newest-first), so order the endpoints before treating them as a range.
  const trackingQueryArgs = buildTrackingQueryArgs(safeDateStrings);

  // Guard: Skip tracking query if no valid date range
  const trackingQuery = useCachedQuery(
    api.habits.getTracking,
    trackingQueryArgs,
    { entryName: 'habits.getTracking', fallbackToLatest: false }
  );

  // Guard: When Convex is unreachable, trackingQuery will be undefined
  const tracking = Array.isArray(trackingQuery) ? trackingQuery : EMPTY;

  return { habits, isHabitsLoading, settings, tracking };
}
