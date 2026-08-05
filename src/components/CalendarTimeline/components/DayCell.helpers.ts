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
  statusText: string,
  effortText?: string
): string => {
  const dayLabel = isCurrentDay
    ? `Today, ${baseLabel}, ${statusText}`
    : `${baseLabel}, ${statusText}`;
  return effortText ? `${dayLabel}, ${effortText}` : dayLabel;
};

/** Describe the visible forecast without relying on color alone. */
export const getEffortAccessibilityText = ({
  capacityMinutes,
  isCurrentDay,
  isUpcoming,
  plannedMinutes,
  remainingMinutes,
}: {
  capacityMinutes?: number;
  isCurrentDay: boolean;
  isUpcoming: boolean;
  plannedMinutes?: number;
  remainingMinutes?: number;
}): string | undefined => {
  if (isCurrentDay) {
    if (remainingMinutes === undefined) return undefined;
    return remainingMinutes > 0
      ? `about ${remainingMinutes} minutes remaining`
      : 'habit plan complete';
  }
  if (!isUpcoming || plannedMinutes === undefined) return undefined;
  return capacityMinutes !== undefined && plannedMinutes > capacityMinutes
    ? `${plannedMinutes} minute forecast, over ${capacityMinutes} minute capacity`
    : `${plannedMinutes} minute forecast`;
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
