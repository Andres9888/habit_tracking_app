/**
 * OPTIMIZED: useHabitData
 * 
 * Uses shared contexts instead of duplicate queries
 * Fixes conditional query evaluation issue
 * 
 * Performance improvements:
 * - Eliminates duplicate habits.list query
 * - Eliminates duplicate settings.get query
 * - Properly skips tracking query when no dates provided
 * - Uses range query (startDate/endDate) by default for better performance
 */

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useHabitsData } from '../../../contexts/HabitsDataContext';
import { useSettings } from '../../../contexts/SettingsContext';

export function useHabitData(extendedDateStrings: string[]) {
  // Guard against empty or invalid date strings array
  const safeDateStrings =
    Array.isArray(extendedDateStrings) && extendedDateStrings.length > 0
      ? extendedDateStrings
      : [];

  // Use shared contexts instead of duplicate queries
  const { habits, isLoading: isHabitsLoading } = useHabitsData();
  const { settings } = useSettings();

  // Use startDate/endDate range to reduce query arg payload (~4KB → ~50 bytes)
  const startDate = safeDateStrings[0];
  const endDate = safeDateStrings.at(-1);

  // Properly skip tracking query if no valid date range
  const trackingQuery = useQuery(
    api.habits.getTracking,
    startDate && endDate
      ? { endDate, startDate }
      : 'skip' // Use 'skip' instead of conditional evaluation
  );

  // Guard: When Convex is unreachable, trackingQuery will be undefined
  const tracking = Array.isArray(trackingQuery) ? trackingQuery : [];

  return { habits, isHabitsLoading, settings, tracking };
}
