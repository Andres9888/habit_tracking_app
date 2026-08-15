import { addDays, differenceInCalendarDays, format } from 'date-fns';
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
  done: boolean,
  isToday: boolean,
  timeLabel?: string
): { subtitle: string; title: string } {
  if (done) {
    return {
      subtitle: timeLabel ? `Logged at ${timeLabel}` : 'Logged as completed.',
      title: 'Completed',
    };
  }
  if (isToday) {
    return {
      subtitle: 'Today is still open. You can log it here or from the habit.',
      title: 'Not logged yet',
    };
  }
  return {
    subtitle: 'Nothing was recorded for this day.',
    title: 'No entry',
  };
}
