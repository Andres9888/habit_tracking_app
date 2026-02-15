
import type { AffirmationFrequency } from './types';
import { getNextWeeklyOccurrence } from './weeklyUtils';
import { parseTimeString } from '../timeUtils';

/**
 * Get relative time string for the next affirmation delivery
 * Examples: "In 8 hours", "Tomorrow at 7am", "Wed at 9am"
 */
export function getNextAffirmationDeliveryRelativeTime(
  scheduledTime: string,
  frequency: AffirmationFrequency,
  daysOfWeek?: number[]
): string | null {
  if (!scheduledTime) {
    return null;
  }

  const { hours, minutes } = parseTimeString(scheduledTime);
  const now = new Date();

  let nextDelivery: Date;

  if (frequency === 'daily') {
    // Daily: next occurrence is today (if not passed) or tomorrow
    nextDelivery = new Date(now);
    nextDelivery.setHours(hours, minutes, 0, 0);

    if (nextDelivery.getTime() <= now.getTime()) {
      nextDelivery.setDate(nextDelivery.getDate() + 1);
    }
  } else {
    // Weekly: find next scheduled day
    if (!daysOfWeek || daysOfWeek.length === 0) {
      return null;
    }
    nextDelivery = getNextWeeklyOccurrence(hours, minutes, daysOfWeek);
  }

  return formatDeliveryTime(nextDelivery, now);
}

function formatDeliveryTime(nextDelivery: Date, now: Date): string {
  const diffMs = nextDelivery.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Format time for display
  const displayHours = nextDelivery.getHours() % 12 || 12;
  const period = nextDelivery.getHours() >= 12 ? 'pm' : 'am';
  const displayMinutes = nextDelivery.getMinutes();
  const timeStr =
    displayMinutes === 0
      ? `${displayHours}${period}`
      : `${displayHours}:${displayMinutes.toString().padStart(2, '0')}${period}`;

  // Day names for weekly display
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Check if it's today
  const isToday =
    nextDelivery.getDate() === now.getDate() &&
    nextDelivery.getMonth() === now.getMonth() &&
    nextDelivery.getFullYear() === now.getFullYear();

  // Check if it's tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    nextDelivery.getDate() === tomorrow.getDate() &&
    nextDelivery.getMonth() === tomorrow.getMonth() &&
    nextDelivery.getFullYear() === tomorrow.getFullYear();

  if (isToday) {
    // Same day - show relative time
    if (diffMinutes < 60) {
      return `In ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
    }
    const remainingMinutes = diffMinutes % 60;
    if (remainingMinutes === 0) {
      return `In ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
    }
    return `In ${diffHours}h ${remainingMinutes}m`;
  }

  if (isTomorrow) {
    return `Tomorrow at ${timeStr}`;
  }

  // For weekly, show day name
  const dayName = dayNames[nextDelivery.getDay()];
  return `${dayName} at ${timeStr}`;
}
