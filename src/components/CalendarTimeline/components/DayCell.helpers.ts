import type { CompletionStatus } from '../CalendarTimeline.types';

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
