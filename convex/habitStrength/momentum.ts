/**
 * Momentum-Based Strength Calculation (v2.0)
 * Forgiving strength formula with streak protection
 */
import {
  BASE_DECAY,
  GROWTH_RATE,
  MS_PER_DAY,
  SHIELD_EFFECTIVENESS,
} from './constants';
import {
  addDays,
  findEarliestTrackingDate,
  formatDateKey,
  parseDateKeyToLocalDate,
  startOfDay,
} from './dateUtils';
import type { HabitTrackingRecord, StrengthLevel } from './types';
import { getStrengthLevel } from './strengthLevel';

/** Calculate new habit strength after a completion or miss */
export function calculateNewStrength(
  currentStrength: number,
  completed: boolean,
  completionsLast7Days: number
): number {
  const strength = Math.max(0, Math.min(100, currentStrength));
  const recentCompletions = Math.max(0, Math.min(7, completionsLast7Days));

  if (completed) {
    const gap = 100 - strength;
    return Math.min(100, strength + gap * GROWTH_RATE);
  }
  const streakShield = recentCompletions / 7;
  const protectedDecay = BASE_DECAY * (1 - streakShield * SHIELD_EFFECTIVENESS);
  return Math.max(0, strength * (1 - protectedDecay));
}

/** Calculate strength snapshot by simulating day-by-day strength changes */
export function calculateMomentumStrengthSnapshot({
  habitCreatedAt,
  throughDate,
  tracking,
}: {
  habitCreatedAt: number;
  throughDate?: string;
  tracking: HabitTrackingRecord[];
}): {
  daysProcessed: number;
  strength: number;
  strength100: number;
  strengthLevel: StrengthLevel;
} {
  const evaluationDateKey =
    throughDate ?? formatDateKey(startOfDay(new Date()));
  const evaluationDate = parseDateKeyToLocalDate(evaluationDateKey);
  const creationDate = startOfDay(new Date(habitCreatedAt));

  const earliestDateKey = findEarliestTrackingDate(tracking);
  const earliestDate = earliestDateKey
    ? parseDateKeyToLocalDate(earliestDateKey)
    : null;

  const startDate =
    earliestDate && earliestDate.getTime() < creationDate.getTime()
      ? earliestDate
      : creationDate;

  if (startDate.getTime() > evaluationDate.getTime()) {
    return {
      daysProcessed: 0,
      strength: 0,
      strength100: 0,
      strengthLevel: getStrengthLevel(0),
    };
  }

  const completionDates = new Set(
    tracking.filter((r) => r.completed).map((r) => r.date)
  );

  const daysProcessed =
    Math.floor((evaluationDate.getTime() - startDate.getTime()) / MS_PER_DAY) +
    1;

  let strength100 = 0;

  for (
    let cursor = new Date(startDate);
    cursor.getTime() <= evaluationDate.getTime();
    cursor = addDays(cursor, 1)
  ) {
    const dateKey = formatDateKey(cursor);
    let completionsLast7Days = 0;
    for (let offset = 1; offset <= 7; offset++) {
      if (completionDates.has(formatDateKey(addDays(cursor, -offset)))) {
        completionsLast7Days++;
      }
    }
    strength100 = calculateNewStrength(
      strength100,
      completionDates.has(dateKey),
      completionsLast7Days
    );
  }

  const strength = strength100 / 100;
  return {
    daysProcessed,
    strength,
    strength100,
    strengthLevel: getStrengthLevel(strength),
  };
}
