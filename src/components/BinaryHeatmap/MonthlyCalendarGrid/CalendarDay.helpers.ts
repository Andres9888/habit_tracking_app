/** CalendarDay helpers — text color resolution + accessibility strings. */
import type { DayData } from './types';
import { habitDayStateLabel } from '../../../features/habits/habitDayState';

export interface CalendarDayColors {
  inverse: string;
  muted: string;
  primary: string;
  tertiary: string;
}

interface TextColorOptions {
  habitColor: string;
  showCompleted: boolean;
  todayPending: boolean;
  useSolid: boolean;
}

export function getTextColorEndpoints(
  day: DayData,
  c: CalendarDayColors,
  habitColor: string,
  todayPending: boolean,
  useSolid: boolean
): { complete: string; incomplete: string } {
  return {
    complete: getTextColor(day, c, {
      habitColor,
      showCompleted: true,
      todayPending: false,
      useSolid,
    }),
    incomplete: getTextColor(day, c, {
      habitColor,
      showCompleted: false,
      todayPending,
      useSolid,
    }),
  };
}

export function getTextColor(
  day: DayData,
  c: CalendarDayColors,
  { habitColor, showCompleted, todayPending, useSolid }: TextColorOptions
): string {
  if (showCompleted && useSolid) return c.inverse;
  if (todayPending) return habitColor;
  if (!day?.isCurrentMonth) return c.muted;
  if (day?.isFuture) return c.tertiary;
  return c.primary;
}

export function getDayAccessibility(
  day: DayData,
  showCompleted: boolean,
  showMissed: boolean,
  isToday: boolean
): { hint: string; label: string } {
  const state = showCompleted
    ? 'completed'
    : showMissed
      ? 'missed'
      : habitDayStateLabel(day.state);
  // Adjacent-month filler cells are rendered greyed out and disabled, so their
  // own day state (often 'missed') would announce a miss the user cannot act on.
  const isFiller = !day.isCurrentMonth;
  const unavailable =
    isFiller || day.state === 'before-creation' || day.state === 'upcoming';
  return {
    hint: unavailable
      ? 'Not available'
      : showCompleted
        ? 'Press to mark as incomplete'
        : 'Press to open or update this day',
    label: isFiller
      ? `Day ${day.dayNumber}, not available`
      : `Day ${day.dayNumber}, ${state}${isToday ? ', today' : ''}`,
  };
}
