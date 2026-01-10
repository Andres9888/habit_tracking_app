/**
 * Get the next occurrence of a weekly schedule
 * Returns the Date of the next scheduled day
 */
export function getNextWeeklyOccurrence(
  hours: number,
  minutes: number,
  daysOfWeek: number[]
): Date {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const targetTime = hours * 60 + minutes;

  // Sort days for consistent ordering
  const sortedDays = [...daysOfWeek].sort((a, b) => a - b);

  // Find the next scheduled day
  for (const day of sortedDays) {
    if (day > currentDay || (day === currentDay && targetTime > currentTime)) {
      // This day is in the future
      const daysUntil = day - currentDay;
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + daysUntil);
      nextDate.setHours(hours, minutes, 0, 0);
      return nextDate;
    }
  }

  // All scheduled days have passed this week; schedule for next week
  const nextDay = sortedDays[0];
  const daysUntil = 7 - currentDay + nextDay;
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysUntil);
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

/**
 * Format days of week for display
 * Returns human-readable string like "Mon, Wed, Fri" or "Every day"
 */
export function formatDaysOfWeek(daysOfWeek: number[]): string {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (daysOfWeek.length === 7) {
    return 'Every day';
  }

  const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
  return sortedDays.map((day) => dayNames[day]).join(', ');
}
