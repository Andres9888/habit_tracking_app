import { useMemo } from 'react';
import type { Habit } from '../HabitDetailScreen.types';
import {
  buildDetailWeekStrip,
  computeThirtyDayRate,
} from './buildDetailWeekStrip';

export function useDetailHeroMetrics(
  completedDates: Set<string>,
  habit: Habit,
  today: string
) {
  const schedule = useMemo(
    () => ({ createdAt: habit.createdAt, daysOfWeek: habit.daysOfWeek }),
    [habit.createdAt, habit.daysOfWeek]
  );
  const weekDays = useMemo(
    () => buildDetailWeekStrip(completedDates, today, schedule),
    [completedDates, schedule, today]
  );
  const rate30Day = useMemo(
    () => computeThirtyDayRate(completedDates, today, schedule),
    [completedDates, schedule, today]
  );
  return { rate30Day, weekDays };
}
