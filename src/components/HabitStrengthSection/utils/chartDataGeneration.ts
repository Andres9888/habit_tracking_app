/**
 * Chart Data Generation
 *
 * Generate strength history directly from completion data for charting.
 */

import {
  startOfDay,
  addDays,
  differenceInDays,
  subDays,
  format,
  isValid,
} from 'date-fns';

import type { StrengthSnapshot } from '../../HabitStrengthHistory/types';
import {
  ALGORITHM_MODE_CONFIGS,
  getStrengthLabel,
} from '../../HabitStrengthHistory/strengthUtils';
import type { TimeRange } from '../types';
import { TIME_RANGE_DAYS } from '../constants';

function resolveRates(mode?: string | null): {
  growthRate: number;
  decayRate: number;
} {
  const key = mode && mode in ALGORITHM_MODE_CONFIGS ? mode : 'balanced';
  return ALGORITHM_MODE_CONFIGS[key];
}

/** Safely format a date, returning empty string on error */
function safeFormatDate(date: Date): string {
  try {
    if (!date || !(date instanceof Date) || !isValid(date)) {
      return '';
    }
    return format(date, 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

/**
 * Generate strength history directly from completedDates.
 *
 * This bypasses the useHabitStrength hook which may have incorrect
 * habitCreatedAt timestamps. Instead, we find the earliest completion
 * date and simulate the exponential smoothing algorithm from there.
 *
 * @param completedDates - Set of completion dates (YYYY-MM-DD format)
 * @param timeRange - Time range filter (1m/1y/all)
 * @returns Array of StrengthSnapshot for charting
 */
export function generateChartDataFromCompletions(
  completedDates: Set<string>,
  timeRange: TimeRange,
  mode?: string | null
): StrengthSnapshot[] {
  const { growthRate, decayRate } = resolveRates(mode);
  if (completedDates.size === 0) {
    return [];
  }

  // Find the earliest completion date
  const sortedDates = [...completedDates].sort();
  const firstDateStr = sortedDates[0];

  // Validate date string exists and is parseable
  if (!firstDateStr) {
    return [];
  }

  const earliestDate = startOfDay(new Date(firstDateStr));
  const today = startOfDay(new Date());

  // Validate parsed date is valid (catches Invalid Date)
  if (Number.isNaN(earliestDate.getTime())) {
    return [];
  }

  // Apply time range filter to start date
  const days = TIME_RANGE_DAYS[timeRange];
  const timeRangeStart = startOfDay(subDays(today, days));

  // Use the later of earliest completion or time range start
  // Convert to timestamps for proper comparison
  const chartStartDate = new Date(
    Math.max(timeRangeStart.getTime(), earliestDate.getTime())
  );

  // We need to calculate strength from the very beginning to get accurate values
  // even if we only display from chartStartDate
  const totalDays = differenceInDays(today, earliestDate) + 1;

  // Guard against negative or extremely large day counts (prevents infinite loops)
  if (totalDays <= 0 || totalDays > 3650) {
    return [];
  }

  // Generate full history from earliest date
  const fullHistory: StrengthSnapshot[] = [];
  let strength = 0;
  let currentDate = earliestDate;

  for (let i = 0; i < totalDays; i++) {
    const dateStr = safeFormatDate(currentDate);
    // Skip iteration if date formatting failed (invalid date)
    if (!dateStr) {
      currentDate = addDays(currentDate, 1);
      continue;
    }
    const wasCompleted = completedDates.has(dateStr);

    // Apply exponential smoothing (mode-aware to match backend)
    strength = wasCompleted
      ? strength + (1 - strength) * growthRate
      : strength * decayRate;

    // Convert to percentage (0-100)
    const strengthPercent = Math.round(strength * 1000) / 10;

    // Only include in result if on or after chart start date
    if (currentDate.getTime() >= chartStartDate.getTime()) {
      fullHistory.push({
        date: new Date(currentDate),
        dateString: dateStr,
        label: getStrengthLabel(strengthPercent),
        strength: strengthPercent,
      });
    }

    currentDate = addDays(currentDate, 1);
  }

  return fullHistory;
}
