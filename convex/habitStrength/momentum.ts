/**
 * Momentum-Based Strength Calculation
 * Gap-fill growth on completion days, proportional decay on miss days.
 * Calibrated to Lally et al. (2010) asymptotic habit formation curve.
 */
import type { AlgorithmParams, StrengthAlgorithmMode } from './algorithmConfig';
import { getAlgorithmConfig } from './algorithmConfig';
import { MS_PER_DAY } from './constants';
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
  _completionsLast7Days: number,
  params?: AlgorithmParams
): number {
  const config = params ?? getAlgorithmConfig('balanced');
  const strength = Math.max(0, Math.min(100, currentStrength));

  if (completed) {
    const gap = 100 - strength;
    return Math.min(100, strength + gap * config.growthRate);
  }
  return Math.max(0, strength * (1 - config.baseDecay));
}

/** Calculate strength snapshot by simulating day-by-day strength changes */
export function calculateMomentumStrengthSnapshot({
  habitCreatedAt,
  mode,
  skipDate,
  throughDate,
  tracking,
}: {
  habitCreatedAt: number;
  mode?: StrengthAlgorithmMode;
  skipDate?: (dateKey: string) => boolean;
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
    tracking.flatMap((r) => (r.completed ? [r.date] : []))
  );

  const daysProcessed =
    Math.floor((evaluationDate.getTime() - startDate.getTime()) / MS_PER_DAY) +
    1;

  const config = getAlgorithmConfig(mode);
  let strength100 = 0;

  for (
    let cursor = new Date(startDate);
    cursor.getTime() <= evaluationDate.getTime();
    cursor = addDays(cursor, 1)
  ) {
    const dateKey = formatDateKey(cursor);
    if (skipDate?.(dateKey)) continue;
    strength100 = calculateNewStrength(
      strength100,
      completionDates.has(dateKey),
      0,
      config
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
