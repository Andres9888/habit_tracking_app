import { isValid, parse } from 'date-fns';
import type { Habit, HabitStatus } from '../types';

const DATE_FORMAT = 'yyyy-MM-dd';

export const DEFAULT_HABIT_EFFORT_MINUTES = 10;
export const DEFAULT_DAILY_HABIT_CAPACITY_MINUTES = 60;

export interface DayEffortForecast {
  capacityMinutes: number;
  plannedMinutes: number;
  remainingMinutes: number;
}

interface BuildHabitEffortForecastArgs {
  dateStrings: string[];
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  habits: Habit[];
  todayString: string;
  capacityMinutes?: number;
}

export function resolveHabitEffortMinutes(effortMinutes?: number): number {
  return typeof effortMinutes === 'number' &&
    Number.isInteger(effortMinutes) &&
    effortMinutes > 0
    ? effortMinutes
    : DEFAULT_HABIT_EFFORT_MINUTES;
}

export function isHabitScheduledOnDate(
  habit: Pick<Habit, 'daysOfWeek' | 'paused'>,
  dateString: string
): boolean {
  if (habit.paused) return false;
  const date = parse(dateString, DATE_FORMAT, new Date());
  if (!isValid(date)) return false;

  const scheduledDays = habit.daysOfWeek;
  if (scheduledDays === undefined || scheduledDays.length >= 7) return true;
  if (scheduledDays.length === 0) return false;
  return scheduledDays.includes(date.getDay());
}

export function buildHabitEffortForecast({
  capacityMinutes = DEFAULT_DAILY_HABIT_CAPACITY_MINUTES,
  dateStrings,
  getHabitStatus,
  habits,
  todayString,
}: BuildHabitEffortForecastArgs): Record<string, DayEffortForecast> {
  const result: Record<string, DayEffortForecast> = {};

  for (const dateString of dateStrings) {
    let plannedMinutes = 0;
    let remainingMinutes = 0;

    for (const habit of habits) {
      if (!isHabitScheduledOnDate(habit, dateString)) continue;
      const effortMinutes = resolveHabitEffortMinutes(habit.effortMinutes);
      plannedMinutes += effortMinutes;
      if (getHabitStatus(habit._id, dateString) !== 'done') {
        remainingMinutes += effortMinutes;
      }
    }

    result[dateString] = {
      capacityMinutes,
      plannedMinutes,
      remainingMinutes:
        dateString === todayString ? remainingMinutes : plannedMinutes,
    };
  }

  return result;
}
