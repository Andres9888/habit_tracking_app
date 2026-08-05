import { format } from 'date-fns';

import type { CompletionStatus } from '../CalendarTimeline.types';

export interface DayLabels {
  weekday: string;
  dayNumber: string;
  /** Uppercase month abbreviation, only on the 1st of the month */
  monthPrefix: string | undefined;
  /** e.g. "Mon, Jan 1" (without the "Today," prefix) */
  baseLabel: string;
}

/**
 * Compute all date-derived labels for a day cell in one pass. Consolidates the
 * four date-fns format() calls so callers can memoize on the date alone.
 */
export const formatDayLabels = (date: Date): DayLabels => {
  const weekday = format(date, 'EEE');
  const dayNumber = format(date, 'd');
  const month = format(date, 'MMM');
  return {
    baseLabel: `${weekday}, ${month} ${dayNumber}`,
    dayNumber,
    monthPrefix: date.getDate() === 1 ? month.toUpperCase() : undefined,
    weekday,
  };
};

/** Map completion status to accessibility text */
export const getStatusText = (status: CompletionStatus): string => {
  switch (status) {
    case 'complete': {
      return 'all habits complete';
    }
    case 'partial': {
      return 'some habits complete';
    }
    case 'future': {
      return 'upcoming';
    }
    default: {
      return 'no habits complete';
    }
  }
};

/** Build accessibility label for a day cell */
export const buildAccessibilityLabel = (
  isCurrentDay: boolean,
  baseLabel: string,
  statusText: string
): string => {
  return isCurrentDay
    ? `Today, ${baseLabel}, ${statusText}`
    : `${baseLabel}, ${statusText}`;
};

/** Get accessibility hint for day press action */
export const getAccessibilityHint = (
  canPressDay: boolean,
  isDayDisabled: boolean
): string | undefined => {
  if (canPressDay) {
    return 'Double tap to view and edit habits for this day';
  }
  if (isDayDisabled) {
    return 'Cannot edit habits for future dates';
  }
  return undefined;
};
