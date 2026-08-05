import { format, parseISO } from 'date-fns';
import type { Habit, TrackingEntry } from './types';

const FREQUENCY_LABELS: Record<string, string> = {
  custom: 'Custom',
  daily: 'Daily',
  weekly: 'Weekly',
};

export function buildScheduleLabel(habit: Habit): string | undefined {
  const { frequency, reminderTime, preferredTime } = habit;
  const formattedFrequency = frequency
    ? FREQUENCY_LABELS[frequency] ||
      frequency
        .split('_')
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ')
    : undefined;
  const formattedTime =
    reminderTime ||
    (preferredTime ? preferredTime.charAt(0).toUpperCase() + preferredTime.slice(1) : undefined);

  if (formattedFrequency && formattedTime) {
    return `${formattedFrequency} · ${formattedTime}`;
  }

  return formattedFrequency || formattedTime;
}

export function getLatestMissedBadge(
  trackingEntries: TrackingEntry[],
  todayDate: string
): string | null {
  const previousMiss = trackingEntries
    .filter((entry) => !entry.completed && entry.date < todayDate)
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  if (!previousMiss) {
    return null;
  }

  return `Missed ${format(parseISO(previousMiss.date), 'EEE')}`;
}
