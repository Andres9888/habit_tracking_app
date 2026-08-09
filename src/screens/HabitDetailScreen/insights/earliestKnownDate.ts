/** Earliest date known for a habit's insight window. */
import { getLocalDateString } from '../../../utils/getLocalDateString';
import type { InsightEntry } from './types';

export function earliestKnownDate(
  entries: InsightEntry[],
  habitCreatedAt: number | undefined,
  today: string
): string {
  const candidates: string[] = [];
  if (habitCreatedAt) {
    candidates.push(getLocalDateString(new Date(habitCreatedAt)));
  }
  for (const entry of entries) candidates.push(entry.date);
  if (candidates.length === 0) return today;
  let min = candidates[0];
  for (const date of candidates) {
    if (date < min) min = date;
  }
  return min;
}
