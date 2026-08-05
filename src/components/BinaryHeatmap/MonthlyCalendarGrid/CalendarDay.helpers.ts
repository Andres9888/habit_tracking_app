/** CalendarDay helpers — text color resolution + accessibility strings. */
import type { DayData } from './types';

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
  const state = showCompleted ? ', completed' : showMissed ? ', missed' : '';
  return {
    hint: day?.isFuture
      ? 'Not available'
      : showCompleted
        ? 'Press to mark as incomplete'
        : 'Press to mark as complete',
    label: `Day ${day?.dayNumber ?? ''}${state}${isToday ? ', today' : ''}`,
  };
}
