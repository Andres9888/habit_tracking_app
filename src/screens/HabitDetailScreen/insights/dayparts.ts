/**
 * "What's working" — which slice of the day this habit reliably lands in.
 *
 * The tracking table stores only {date, completed}, so completion *time* is
 * inferred from the Convex row's `_creationTime`. That is only trustworthy when
 * the row was created on the day it records; a row back-filled days later says
 * nothing about when the habit actually happened, so those are dropped.
 */

import { DAYPARTS, daypartForHour } from './daypartTable';
import { parseLocalDate } from './schedule';
import type { DaypartKey, InsightEntry, WorkingInsight } from './types';

export { DAYPARTS, daypartForHour };

/** Below this many trustworthy timestamps the split is noise — hide the card. */
const MIN_SAMPLE = 8;
/** The winning daypart must hold at least this share to be worth stating. */
const MIN_SHARE = 0.55;

/** Keep only completions whose row was created on the date it records. */
export function sameDayCompletions(entries: InsightEntry[]): number[] {
  const hours: number[] = [];
  for (const entry of entries) {
    if (!entry.completed) continue;
    const created = new Date(entry.createdAt);
    const recorded = parseLocalDate(entry.date);
    if (
      created.getFullYear() !== recorded.getFullYear() ||
      created.getMonth() !== recorded.getMonth() ||
      created.getDate() !== recorded.getDate()
    ) {
      continue;
    }
    hours.push(created.getHours());
  }
  return hours;
}

/** Parse "6:45 AM" / "18:30" into an hour, or null when unparseable. */
export function reminderHour(reminderTime?: string): number | null {
  if (!reminderTime) return null;
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(reminderTime.trim());
  if (!match) return null;
  let hour = Number(match[1]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  return hour >= 0 && hour < 24 ? hour : null;
}

export function findWorkingWindow(
  entries: InsightEntry[],
  reminderTime?: string
): WorkingInsight | null {
  const hours = sameDayCompletions(entries);
  if (hours.length < MIN_SAMPLE) return null;

  const tally = new Map<DaypartKey, number>();
  for (const hour of hours) {
    const key = daypartForHour(hour).key;
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }

  let best = DAYPARTS[0]!;
  let bestCount = 0;
  for (const part of DAYPARTS) {
    const count = tally.get(part.key) ?? 0;
    if (count > bestCount) {
      best = part;
      bestCount = count;
    }
  }

  const share = bestCount / hours.length;
  if (share < MIN_SHARE) return null;

  const hour = reminderHour(reminderTime);
  const sharePct = Math.round(share * 100);
  return {
    daypart: best,
    otherPct: 100 - sharePct,
    reminderInWindow:
      hour !== null && hour >= best.startHour && hour < best.endHour,
    reminderTime,
    sample: hours.length,
    sharePct,
  };
}
