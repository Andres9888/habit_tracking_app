import { isFutureDate } from './utils';

const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidDateKey(value: string): boolean {
  const match = DATE_KEY.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    year >= 1900 &&
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function assertNoteDateAllowed(date: string, timezone?: string): void {
  if (!isValidDateKey(date)) {
    throw new Error('Invalid date');
  }
  if (isFutureDate(date, timezone)) {
    throw new Error('Cannot add notes for future dates');
  }
}
