import { getLocalDateString } from '../../utils/getLocalDateString';
import { isPausedMissDay } from '../../../convex/streakUtils/pausePeriod';
import {
  isScheduledWeekday,
  parseLocalDate,
  scheduledWeekdays,
} from './habitSchedule';

export type HabitDayState =
  | 'before-creation'
  | 'completed'
  | 'missed'
  | 'open-today'
  | 'paused'
  | 'unscheduled'
  | 'upcoming';

export interface HabitDayContext {
  createdAt?: number;
  daysOfWeek?: number[];
  pausedAt?: number;
  resumedAt?: number;
}

interface HabitDayStateInput extends HabitDayContext {
  completed?: boolean;
  date: string;
  today: string;
}

export const HABIT_DAY_STATE_LABEL: Record<HabitDayState, string> = {
  'before-creation': 'before habit started',
  completed: 'completed',
  missed: 'missed',
  'open-today': 'not logged yet',
  paused: 'paused',
  unscheduled: 'not scheduled',
  upcoming: 'upcoming',
};

export function habitDayStateLabel(
  state: HabitDayState,
  sentenceCase = false
): string {
  const label = HABIT_DAY_STATE_LABEL[state];
  return sentenceCase ? label.charAt(0).toUpperCase() + label.slice(1) : label;
}

/** Canonical record state shared by Detail week, History, Day, and month grid. */
export function getHabitDayState({
  completed = false,
  createdAt,
  date,
  daysOfWeek,
  pausedAt,
  resumedAt,
  today,
}: HabitDayStateInput): HabitDayState {
  if (completed) return 'completed';

  if (
    createdAt !== undefined &&
    date < getLocalDateString(new Date(createdAt))
  ) {
    return 'before-creation';
  }

  const scheduled = scheduledWeekdays({ daysOfWeek });
  if (!isScheduledWeekday(scheduled, parseLocalDate(date).getDay())) {
    return 'unscheduled';
  }
  if (date > today) return 'upcoming';
  if (
    isPausedMissDay(date, {
      dateKeyForMs: (ms) => getLocalDateString(new Date(ms)),
      pausedAt,
      resumedAt,
    })
  ) {
    return 'paused';
  }
  if (date === today) return 'open-today';
  return 'missed';
}
