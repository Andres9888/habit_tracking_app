/**
 * Get today's date as YYYY-MM-DD string in LOCAL timezone
 *
 * IMPORTANT: Do NOT use `new Date().toISOString().split('T')[0]`
 * as that converts to UTC and causes timezone bugs.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as YYYY-MM-DD string in local timezone
 */
export function getTodayString(): string {
  return getLocalDateString(new Date());
}
