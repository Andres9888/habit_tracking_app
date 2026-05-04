import { useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { WeekDay } from './WeeklyTimeCard.types';

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

export function useWeeklyTime(habitId: Id<'habits'>) {
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const windowStartDate = useMemo(
    () => toDateKey(addDays(new Date(), -6)),
    []
  );
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const data = useQuery(api.tracking.getWeeklyMinutes, {
    habitId,
    weekStartDate: windowStartDate,
  });

  const days = useMemo<WeekDay[]>(() => {
    const start = addDays(new Date(), -6);
    return Array.from({ length: 7 }, (_, idx) => {
      const d = addDays(start, idx);
      const dateKey = toDateKey(d);
      return {
        date: dateKey,
        label: DAY_LETTERS[d.getDay()],
        minutes: data?.byDate?.[dateKey] ?? 0,
        isToday: dateKey === todayKey,
      };
    });
  }, [data, todayKey]);

  const totalMinutes = data?.totalMinutes ?? 0;
  const isLoading = data === undefined;

  return {
    days,
    editingDate,
    isLoading,
    openEditor: (date: string) => setEditingDate(date),
    closeEditor: () => setEditingDate(null),
    todayKey,
    totalMinutes,
  };
}
