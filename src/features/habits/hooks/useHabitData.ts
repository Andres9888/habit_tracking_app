import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Habit } from '../types';

export function useHabitData(extendedDateStrings: string[]) {
  const habitsQuery = useQuery(api.habits.list);
  const habits = (habitsQuery ?? []) as Habit[];
  const isHabitsLoading = habitsQuery === undefined;
  const settings = useQuery(api.settings.get);
  const tracking =
    useQuery(api.habits.getTracking, { dates: extendedDateStrings }) ?? [];

  return { habits, isHabitsLoading, settings, tracking };
}
