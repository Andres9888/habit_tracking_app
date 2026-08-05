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
  // Guard against invalid inputs
  if (!completedDates || !(completedDates instanceof Set)) {
    return [];
  }
  if (!startDate || !endDate) {
    return [];
  }
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return [];
  }

  // Guard against extremely large date ranges or reversed dates
  const daysDiff =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff < 0 || daysDiff > 3650) {
    return [];
  }

  const results: StrengthDataPoint[] = [];
  let strength = 0;
  let currentDate = startDate;
  let iterationCount = 0;
  const maxIterations = 3651; // 10 years + 1 day safety limit

  while (currentDate <= endDate && iterationCount < maxIterations) {
    iterationCount++;
    const dateStr = formatDateString(currentDate);

    // Skip if date formatting failed (invalid date state)
    if (!dateStr) {
      currentDate = addDays(currentDate, 1);
      continue;
    }

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
