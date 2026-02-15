
import { useQuery } from 'convex/react';

import type { Habit } from '../types';
import { api } from '../../../../convex/_generated/api';

export function useHabitData(extendedDateStrings: string[]) {
  const habitsQuery = useQuery(api.habits.list);
  const habits = (habitsQuery ?? []);
  const isHabitsLoading = habitsQuery === undefined;
  const settings = useQuery(api.settings.get);
  // Use startDate/endDate range to reduce query arg payload (~4KB → ~50 bytes)
  const startDate = extendedDateStrings[0];
  const endDate = extendedDateStrings.at(-1);
  const tracking =
    useQuery(api.habits.getTracking, startDate && endDate ? { endDate, startDate } : { dates: extendedDateStrings }) ?? [];

  return { habits, isHabitsLoading, settings, tracking };
}
