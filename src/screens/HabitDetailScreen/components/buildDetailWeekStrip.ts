/**
 * Week strip + 30-day rate helpers for the habit detail hero
 * (Open Design path-to-best / week cadence).
 */
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { getWeekStart } from '../../../utils/trendCalculations/dateHelpers';

const DAY_LABS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type DetailWeekDay = {
  date: string;
  done: boolean;
  label: string;
  missed: boolean;
  name: string;
  scheduled: boolean;
  today: boolean;
};

export interface DetailHabitSchedule {
  createdAt?: number | string;
  daysOfWeek?: number[];
}

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getCreationDate(schedule?: DetailHabitSchedule): string | undefined {
  if (schedule?.createdAt === undefined) return undefined;
  const created = new Date(schedule.createdAt);
  if (Number.isNaN(created.getTime())) return undefined;
  return getLocalDateString(created);
}

function isScheduledDate(
  day: Date,
  date: string,
  schedule?: DetailHabitSchedule
): boolean {
  if (!isActiveDate(date, schedule)) return false;
  const selectedDays = schedule?.daysOfWeek;
  return !selectedDays?.length || selectedDays.includes(day.getDay());
}

function isActiveDate(date: string, schedule?: DetailHabitSchedule): boolean {
  const creationDate = getCreationDate(schedule);
  return !creationDate || date >= creationDate;
}

export function buildDetailWeekStrip(
  completedDates: Set<string>,
  todayStr: string = getLocalDateString(),
  schedule?: DetailHabitSchedule
): DetailWeekDay[] {
  const today = parseLocalDate(todayStr);
  const monday = getWeekStart(today);

  return DAY_LABS.map((label, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const date = getLocalDateString(day);
    const scheduled = isScheduledDate(day, date, schedule);
    const done = completedDates.has(date);
    const isToday = date === todayStr;
    const missed = scheduled && date < todayStr && !done;
    return {
      date,
      done,
      label,
      missed,
      name: DAY_NAMES[i],
      scheduled,
      today: isToday,
    };
  });
}

export function isWeekStripEmpty(days: DetailWeekDay[]): boolean {
  return days.every((d) => !d.done);
}

/** Completions in the last 30 calendar days including today (0–100). */
export function computeThirtyDayRate(
  completedDates: Set<string>,
  todayStr: string = getLocalDateString(),
  schedule?: DetailHabitSchedule
): number {
  const today = parseLocalDate(todayStr);
  let done = 0;
  let eligible = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = getLocalDateString(d);
    if (!isActiveDate(date, schedule)) continue;
    if (isScheduledDate(d, date, schedule)) eligible += 1;
    if (completedDates.has(date)) done += 1;
  }
  return eligible === 0
    ? 0
    : Math.min(100, Math.round((done / eligible) * 100));
}
