import { useCallback, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { eachDayOfInterval, format, subMonths } from 'date-fns';
import type { Id } from '../../convex/_generated/dataModel';
import { api } from '../../convex/_generated/api';
import { reduce } from 'ramda';

export type HabitStatus = 'done' | 'missed' | 'planned';

type HabitTrackingEntry = {
  completed: boolean;
  date: string;
  habitId: Id<'habits'>;
};

export const buildTrackingIndex = (
  entries: HabitTrackingEntry[],
): Map<Id<'habits'>, Map<string, HabitTrackingEntry>> => {
  return reduce<HabitTrackingEntry, Map<Id<'habits'>, Map<string, HabitTrackingEntry>>>(
    (accumulator, entry) => {
      if (!accumulator.has(entry.habitId)) {
        accumulator.set(entry.habitId, new Map());
      }
      accumulator.get(entry.habitId)?.set(entry.date, entry);
      return accumulator;
    },
    new Map(),
    entries,
  );
};

export const buildCompletedDateSets = (
  trackingIndex: Map<Id<'habits'>, Map<string, HabitTrackingEntry>>,
): Map<Id<'habits'>, Set<string>> => {
  return reduce<
    [Id<'habits'>, Map<string, HabitTrackingEntry>],
    Map<Id<'habits'>, Set<string>>
  >(
    (accumulator, [habitId, dateMap]) => {
      const completedDates = Array.from(dateMap.values())
        .filter((entry) => entry.completed)
        .map((entry) => entry.date);
      accumulator.set(habitId, new Set(completedDates));
      return accumulator;
    },
    new Map(),
    Array.from(trackingIndex.entries()),
  );
};

const parseLocalDateFromISO = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const parsedDate = new Date(year, month - 1, day);
  parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};

export const useHabitsData = (today: Date) => {
  const extendedDateRange = useMemo(() => {
    const endDate = new Date(today);
    endDate.setHours(0, 0, 0, 0);
    const startDate = subMonths(endDate, 12);
    return eachDayOfInterval({ end: endDate, start: startDate });
  }, [today]);

  const extendedDateStrings = useMemo(
    () => extendedDateRange.map((date) => format(date, 'yyyy-MM-dd')),
    [extendedDateRange],
  );

  const habitsQuery = useQuery(api.habits.list);
  const trackingQuery = useQuery(api.habits.getTracking, { dates: extendedDateStrings });

  const habits = habitsQuery ?? [];
  const tracking = trackingQuery ?? [];

  const trackingIndex = useMemo(() => buildTrackingIndex(tracking), [tracking]);
  const completedDatesByHabit = useMemo(
    () => buildCompletedDateSets(trackingIndex),
    [trackingIndex],
  );

  const todayTimestamp = useMemo(() => {
    const normalized = new Date(today);
    normalized.setHours(0, 0, 0, 0);
    return normalized.getTime();
  }, [today]);

  const getHabitStatus = useCallback(
    (habitId: Id<'habits'>, dateString: string): HabitStatus => {
      const habitEntries = trackingIndex.get(habitId);
      const trackingEntry = habitEntries?.get(dateString);

      if (trackingEntry?.completed) {
        return 'done';
      }

      const date = parseLocalDateFromISO(dateString);
      if (date.getTime() < todayTimestamp) {
        return 'missed';
      }
      return 'planned';
    },
    [todayTimestamp, trackingIndex],
  );

  const getStreak = useCallback(
    (habitId: Id<'habits'>) => {
      const completedDates = completedDatesByHabit.get(habitId);
      if (!completedDates?.size) {
        return 0;
      }

      const counterDate = new Date(todayTimestamp);
      const todayKey = format(counterDate, 'yyyy-MM-dd');
      if (!completedDates.has(todayKey)) {
        counterDate.setDate(counterDate.getDate() - 1);
      }

      let streak = 0;
      while (true) {
        const cursorKey = format(counterDate, 'yyyy-MM-dd');
        if (!completedDates.has(cursorKey)) {
          break;
        }
        streak += 1;
        counterDate.setDate(counterDate.getDate() - 1);
      }
      return streak;
    },
    [completedDatesByHabit, todayTimestamp],
  );

  return {
    completedDatesByHabit,
    getHabitStatus,
    getStreak,
    habits,
    isHabitsLoading: habitsQuery === undefined,
    isTrackingLoading: trackingQuery === undefined,
    tracking,
  };
};

export default useHabitsData;
