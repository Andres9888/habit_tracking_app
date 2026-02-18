/**
 * Date Utilities for Habit Strength
 * Date manipulation helpers for strength calculations
 */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Adds a specified number of days to a Date, returning new date at start of day
 * @param date - The starting date
 * @param amount - Number of days to add (can be negative)
 * @returns New Date object at 00:00:00
 */
export function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Formats a Date into ISO-like YYYY-MM-DD string key
 * @param date - Date to format
 * @returns String in format YYYY-MM-DD
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isValidDateKey(dateKey: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey);
}

export function parseDateKeyToLocalDate(dateKey: string): Date {
  if (!isValidDateKey(dateKey)) {
    throw new Error('Invalid date format; expected YYYY-MM-DD');
  }

  const [yearStr, monthStr, dayStr] = dateKey.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const parsed = new Date(year, month - 1, day);
  parsed.setHours(0, 0, 0, 0);

  // Validate we didn't roll the date (e.g. 2025-13-40)
  if (formatDateKey(parsed) !== dateKey) {
    throw new Error('Invalid date value; expected YYYY-MM-DD');
  }

  return parsed;
}

/** Find earliest valid date key from tracking records */
export function findEarliestTrackingDate(
  tracking: Array<{ date: string }>
): string | null {
  let earliest: string | null = null;
  for (const record of tracking) {
    if (!isValidDateKey(record.date)) continue;
    if (!earliest || record.date < earliest) {
      earliest = record.date;
    }
  }
  return earliest;
}
