/**
 * Shared strength iteration logic
 */

import { addDays } from 'date-fns';

import { DEFAULT_DECAY_RATE, DEFAULT_GROWTH_RATE } from './constants';
import { formatDateString } from './formatting';

interface StrengthDataPoint {
  date: Date;
  dateStr: string;
  strength: number;
}

/**
 * Iterate through dates and calculate strength values.
 * Shared logic for both full and sampled timeline generation.
 */
export function iterateStrengthValues(
  completedDates: Set<string>,
  startDate: Date,
  endDate: Date
): StrengthDataPoint[] {
  const results: StrengthDataPoint[] = [];
  let strength = 0;
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const dateStr = formatDateString(currentDate);

    strength = completedDates.has(dateStr)
      ? strength + (1 - strength) * DEFAULT_GROWTH_RATE
      : strength * DEFAULT_DECAY_RATE;

    results.push({
      date: new Date(currentDate),
      dateStr,
      strength: Math.round(strength * 1000) / 10,
    });

    currentDate = addDays(currentDate, 1);
  }

  return results;
}
