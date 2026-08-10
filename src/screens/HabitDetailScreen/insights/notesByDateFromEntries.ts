/** Collect trimmed per-day notes from insight entries. */
import type { InsightEntry } from './types';

export function notesByDateFromEntries(
  entries: InsightEntry[]
): Record<string, string> {
  const notesByDate: Record<string, string> = {};
  for (const entry of entries) {
    const trimmed = entry.note?.trim();
    if (trimmed) notesByDate[entry.date] = trimmed;
  }
  return notesByDate;
}
