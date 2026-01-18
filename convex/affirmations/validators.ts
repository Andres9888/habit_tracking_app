/**
 * Validation helpers for affirmations
 */

/**
 * Validate time string format (HH:MM 24-hour)
 */
export function isValidTimeFormat(time: string): boolean {
  const match = time.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/);
  return match !== null;
}

/**
 * Validate days of week array
 * Days are 0-6 (Sunday-Saturday)
 */
export function isValidDaysOfWeek(days: number[]): boolean {
  if (days.length === 0 || days.length > 7) return false;
  return days.every((day) => day >= 0 && day <= 6 && Number.isInteger(day));
}
