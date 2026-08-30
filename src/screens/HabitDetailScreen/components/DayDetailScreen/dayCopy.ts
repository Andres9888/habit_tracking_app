import { addDays, differenceInCalendarDays, format } from 'date-fns';
import type { HabitDayState } from '../../../../features/habits/habitDayState';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { parseLocalDate } from '../../insights';

export function formatDayTitle(date: string): string {
  return format(parseLocalDate(date), 'EEEE, MMMM d');
}

export function formatDayShort(date: string): string {
  return format(parseLocalDate(date), 'EEE, MMM d');
}

export function dayRelativeLabel(
  date: string,
  today = getLocalDateString()
): string {
  const diff = differenceInCalendarDays(
    parseLocalDate(today),
    parseLocalDate(date)
  );
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff > 1) return `${diff} days ago`;
  return '';
}

export function adjacentDay(
  date: string,
  dir: -1 | 1,
  earliest: string,
  latest: string
): string | null {
  const next = getLocalDateString(addDays(parseLocalDate(date), dir));
  if (next < earliest || next > latest) return null;
  return next;
}

export function dayStatusCopy(
  state: HabitDayState,
  timeLabel?: string
): { subtitle: string; title: string } {
  if (state === 'completed') {
    return {
      subtitle: timeLabel ? `Logged at ${timeLabel}` : 'Logged as completed.',
      title: 'Completed',
    };
  }
  if (state === 'before-creation') {
    return {
      subtitle: 'This habit had not started yet.',
      title: 'Before habit started',
    };
  }
  if (state === 'unscheduled') {
    return {
      subtitle: 'This day is outside this habit’s schedule.',
      title: 'Not scheduled',
    };
  }
  if (state === 'paused') {
    return {
      subtitle: 'This habit was paused on this day.',
      title: 'Paused',
    };
  }
  if (state === 'open-today') {
    return {
      subtitle: 'Today is still open. You can log it here or from the habit.',
      title: 'Not logged yet',
    };
  }
  if (state === 'upcoming') {
    return {
      subtitle: 'This day has not happened yet.',
      title: 'Upcoming',
    };
  }
  return {
    subtitle: 'This scheduled day was not logged.',
    title: 'Missed',
  };
}
