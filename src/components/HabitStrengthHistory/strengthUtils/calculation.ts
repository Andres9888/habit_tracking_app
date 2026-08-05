/**
 * Core Strength Calculation Functions
 *
 * Provides the main strength calculation algorithm using exponential smoothing.
 */

import { addDays, startOfDay } from 'date-fns';

import type { StrengthAlgorithmConfig } from '../types';
import { DEFAULT_DECAY_RATE, DEFAULT_GROWTH_RATE } from './constants';
import { formatDateString } from './formatting';

/**
 * Calculate habit strength at a specific target date.
 *
 * Iterates day-by-day from habit creation to the target date,
 * applying growth on completions and decay on misses.
 *
 * @param completedDates - Set of completed dates in YYYY-MM-DD format
 * @param habitCreatedAt - Date when the habit was created
 * @param targetDate - Date to calculate strength for
 * @param config - Optional algorithm configuration
 * @returns Strength as a percentage (0-100)
 *
 * @example
 * const strength = calculateStrengthAtDate(
 *   new Set(['2024-01-01', '2024-01-02']),
 *   new Date('2024-01-01'),
 *   new Date('2024-01-02')
 * );
 * // Returns ~10 (two completions from zero)
 */
export function calculateStrengthAtDate(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  targetDate: Date,
  config: Partial<StrengthAlgorithmConfig> = {}
): number {
  // Guard against invalid dates
  if (!habitCreatedAt || !targetDate) {
    return 0;
  }
  if (
    Number.isNaN(habitCreatedAt.getTime()) ||
    Number.isNaN(targetDate.getTime())
  ) {
    return 0;
  }

  const growthRate = config.growthRate ?? DEFAULT_GROWTH_RATE;
  const decayRate = config.decayRate ?? DEFAULT_DECAY_RATE;

  const startDate = startOfDay(habitCreatedAt);
  const endDate = startOfDay(targetDate);

  if (endDate < startDate) {
    return 0;
  }

  // Guard against extremely large date ranges (prevent infinite loops)
  const daysDiff =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff > 3650) {
    return 0;
  }

  let strength = 0;
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const dateStr = formatDateString(currentDate);

    // Skip if date formatting failed (invalid date state)
    if (!dateStr) {
      currentDate = addDays(currentDate, 1);
      continue;
    }

    strength = completedDates.has(dateStr)
      ? strength + (1 - strength) * growthRate
      : strength * decayRate;

    currentDate = addDays(currentDate, 1);
  }

  return Math.round(strength * 1000) / 10;
}
