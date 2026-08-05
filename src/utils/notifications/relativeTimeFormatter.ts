import { createDateFromTimeString } from './timeUtils';

/**
 * Get relative time string for the next reminder occurrence
 * Examples: "In 8 hours", "In 35 minutes", "Tomorrow at 7am"
 */
export function getNextReminderRelativeTime(
  reminderTime?: string
): string | null {
  if (!reminderTime) {
    return null;
  }

  const reminderDate = createDateFromTimeString(reminderTime);
  const now = new Date();

  // If the reminder time has passed today, it's for tomorrow
  if (reminderDate.getTime() <= now.getTime()) {
    reminderDate.setDate(reminderDate.getDate() + 1);
  }

  const diffMs = reminderDate.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  return formatRelativeTime(reminderDate, now, diffMinutes, diffHours);
}

export function formatRelativeTime(
  targetDate: Date,
  now: Date,
  diffMinutes: number,
  diffHours: number
): string {
  // Format the time for "Tomorrow at X" display
  const hours = targetDate.getHours();
  const minutes = targetDate.getMinutes();
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  const timeStr =
    minutes === 0
      ? `${displayHours}${period}`
      : `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;

  // Check if it's tomorrow (different day)
  const isTomorrow =
    targetDate.getDate() !== now.getDate() ||
    targetDate.getMonth() !== now.getMonth() ||
    targetDate.getFullYear() !== now.getFullYear();

  if (isTomorrow) {
    return `Tomorrow at ${timeStr}`;
  }

  // Same day - show relative time
  if (diffMinutes < 60) {
    return `In ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
  }

  if (diffHours < 24) {
    const remainingMinutes = diffMinutes % 60;
    if (remainingMinutes === 0) {
      return `In ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
    }
    return `In ${diffHours}h ${remainingMinutes}m`;
  }

  return `Tomorrow at ${timeStr}`;
}
