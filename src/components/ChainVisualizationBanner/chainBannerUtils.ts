/* eslint-disable max-lines */
/**
 * chainBannerUtils.ts
 * Utility functions for the ChainVisualizationBanner component.
 *
 * Computes the "chain day items" array: last N days of the habit's life,
 * each classified as completed | missed | future | pre-habit.
 */

import { subDays, format, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';

export type ChainDayStatus = 'completed' | 'missed' | 'future' | 'pre-habit';

export interface ChainDayData {
  dateString: string;      // 'yyyy-MM-dd'
  dayLabel: string;        // 'M', 'T', 'W', etc.
  status: ChainDayStatus;
  /** streak run length ending at (and including) this day, only for 'completed' days */
  runLength: number;
  /** true if this day is "today" */
  isToday: boolean;
}

/** Number of days to render in the banner */
export const CHAIN_BANNER_DAYS = 28;

/**
 * Build the list of ChainDayData for the banner.
 *
 * @param completedDates  Set of 'yyyy-MM-dd' strings
 * @param habitCreatedAt  Unix timestamp (ms) when habit was created
 * @param todayString     'yyyy-MM-dd' today
 * @param days            How many days to display (default CHAIN_BANNER_DAYS)
 */
export function buildChainDays(
  completedDates: Set<string>,
  habitCreatedAt: number | undefined,
  todayString: string,
  days: number = CHAIN_BANNER_DAYS,
): ChainDayData[] {
  const today = parseISO(todayString);
  const habitStart = habitCreatedAt
    ? startOfDay(new Date(habitCreatedAt))
    : null;

  const result: ChainDayData[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateString = format(date, 'yyyy-MM-dd');
    const dayLabel = format(date, 'EEEEE'); // single letter: M T W T F S S
    const isToday = i === 0;

    let status: ChainDayStatus;
    if (habitStart && isBefore(date, habitStart)) {
      status = 'pre-habit';
    } else if (isAfter(date, today)) {
      status = 'future';
    } else if (completedDates.has(dateString)) {
      status = 'completed';
    } else {
      status = isToday ? 'future' : 'missed';
    }

    result.push({
      dateString,
      dayLabel,
      isToday,
      runLength: 0, // will be filled below
      status,
    });
  }

  // Compute run lengths for completed days
  let run = 0;
  for (const day of result) {
    if (day.status === 'completed') {
      run += 1;
      day.runLength = run;
    } else {
      run = 0;
    }
  }

  return result;
}

/**
 * Compute the current streak (consecutive completed days ending today or yesterday).
 */
export function computeCurrentStreak(
  days: ChainDayData[],
): number {
  // Walk backwards from end
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if (d.status === 'future') continue; // skip today if not done yet
    if (d.status === 'completed') {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Find indices of broken-chain gaps (missed days between completed spans).
 * Returns pairs [gapStart, gapEnd] (both inclusive).
 */
export function findChainGaps(days: ChainDayData[]): Array<[number, number]> {
  const gaps: Array<[number, number]> = [];
  let gapStart: number | null = null;

  for (const [i, d] of days.entries()) {
    if (d.status === 'missed') {
      if (gapStart === null) gapStart = i;
    } else if (gapStart !== null) {
      gaps.push([gapStart, i - 1]);
      gapStart = null;
    }
  }
  if (gapStart !== null) {
    gaps.push([gapStart, days.length - 1]);
  }
  return gaps;
}

/**
 * Determine link size (diameter in px) based on run length.
 * Longer runs produce heavier links — the chain becomes "forged" over time.
 */
export function getLinkSize(runLength: number): number {
  if (runLength >= 21) return 28;
  if (runLength >= 14) return 26;
  if (runLength >= 7)  return 24;
  if (runLength >= 3)  return 22;
  return 20;
}

/**
 * Determine connector height (bar thickness) based on run length.
 */
export function getConnectorHeight(runLength: number): number {
  if (runLength >= 21) return 4;
  if (runLength >= 14) return 3.5;
  if (runLength >= 7)  return 3;
  if (runLength >= 3)  return 2.5;
  return 2;
}

/**
 * Connector opacity evolves with run length.
 */
export function getConnectorOpacity(runLength: number): number {
  if (runLength >= 21) return 0.9;
  if (runLength >= 14) return 0.8;
  if (runLength >= 7)  return 0.7;
  if (runLength >= 3)  return 0.55;
  return 0.4;
}

/**
 * Whether the streak length warrants a shimmer effect on links.
 */
export function shouldShimmer(streak: number): boolean {
  return streak >= 7;
}
