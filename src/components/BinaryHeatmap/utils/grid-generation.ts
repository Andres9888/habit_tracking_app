/**
 * BinaryHeatmap Grid Generation
 *
 * Core logic for generating the GitHub-style binary heatmap grid structure.
 */

import {
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfWeek,
  startOfDay,
  addDays,
  subDays,
} from 'date-fns';
import type {
  TimeRange,
  BinaryDay,
  BinaryMonthLabel,
  BinaryGridData,
} from '../types';
import { getTimeRangeDays, calculateBinaryGridStats } from './calculations';

/**
 * Generate the binary heatmap grid for a given time range
 *
 * The grid is organized as an array of weeks, where each week contains 7 days
 * (Sunday through Saturday). Days outside the time range are null.
 *
 * The grid aligns to week boundaries (starting on Sunday) to ensure consistent
 * column layouts regardless of which day the period starts on.
 *
 * @param timeRange - The time range to display ('3m', '6m', or '1y')
 * @param completedDates - Set of dates in YYYY-MM-DD format that have completions
 * @param habitCreatedAt - Optional Unix timestamp of when the habit was created
 * @param currentDate - Optional reference date (defaults to today, useful for testing)
 * @returns Grid data including weeks array, month labels, and statistics
 *
 * @example
 * const completedDates = new Set(['2025-12-01', '2025-12-02']);
 * const grid = generateBinaryGrid('3m', completedDates, habitCreatedAt);
 * // grid.weeks: array of 7-day weeks
 * // grid.stats: { completions, eligibleDays, completionRate }
 * // grid.monthLabels: [{ label: 'Dec', weekIndex: 0 }, ...]
 */
export function generateBinaryGrid(
  timeRange: TimeRange,
  completedDates: Set<string>,
  habitCreatedAt?: number,
  currentDate: Date = new Date()
): BinaryGridData {
  // Normalize all dates to start of day to avoid time comparison issues
  const today = startOfDay(currentDate);
  const todayStr = format(today, 'yyyy-MM-dd');
  const daysToShow = getTimeRangeDays(timeRange);

  // Calculate start date (daysToShow days back from today, inclusive)
  // For 91 days: today is day 1, so we go back 90 days to get 91 total
  const endDate = today;
  const startDate = subDays(today, daysToShow - 1);

  // Find the Sunday at or before the start date to align the grid
  const gridStartDate = startOfWeek(startDate, { weekStartsOn: 0 }); // 0 = Sunday

  const habitCreatedDate = habitCreatedAt
    ? startOfDay(new Date(habitCreatedAt))
    : null;

  const weeks: (BinaryDay | null)[][] = [];
  const monthLabels: BinaryMonthLabel[] = [];

  let currentWeek: (BinaryDay | null)[] = [];
  let weekIndex = 0;
  let lastMonth = -1;

  // Iterate from grid start (aligned Sunday) through end date
  let iterDate = new Date(gridStartDate);

  while (iterDate <= endDate) {
    const dayOfWeek = iterDate.getDay(); // 0 = Sunday
    const dateStr = format(iterDate, 'yyyy-MM-dd');
    const isInRange = iterDate >= startDate && iterDate <= endDate;
    const isToday = dateStr === todayStr;
    const isFuture = isAfter(iterDate, today) && !isToday;

    // A day is "before creation" ONLY if:
    // 1. It's before the habit creation date AND
    // 2. There's no completion data for that date (allows backdated entries)
    const hasCompletionData = completedDates.has(dateStr);
    const isBeforeCreation = habitCreatedDate
      ? isBefore(iterDate, habitCreatedDate) &&
        !isSameDay(iterDate, habitCreatedDate) &&
        !hasCompletionData
      : false;

    // Track month changes for labels (only for dates in range)
    if (isInRange) {
      const currentMonth = iterDate.getMonth();
      if (currentMonth !== lastMonth) {
        monthLabels.push({
          label: format(iterDate, 'MMM'), // Short month name: "Oct", "Nov", etc.
          weekIndex,
        });
        lastMonth = currentMonth;
      }
    }

    // Only add actual day data if it's within our display range
    if (isInRange) {
      currentWeek[dayOfWeek] = {
        completed: completedDates.has(dateStr),
        date: dateStr,
        isBeforeCreation,
        isFuture,
        isToday,
      };
    } else if (iterDate < startDate) {
      // Padding before the range starts - null for empty cells
      currentWeek[dayOfWeek] = null;
    }

    // Complete week (Saturday reached)
    if (dayOfWeek === 6) {
      // Fill any missing slots in the week with null
      for (let i = 0; i < 7; i++) {
        if (currentWeek[i] === undefined) {
          currentWeek[i] = null;
        }
      }
      weeks.push([...currentWeek]);
      currentWeek = [];
      weekIndex++;
    }

    iterDate = addDays(iterDate, 1);
  }

  // Add partial final week if it has any data
  if (currentWeek.length > 0) {
    // Fill remaining slots with null
    for (let i = 0; i < 7; i++) {
      if (currentWeek[i] === undefined) {
        currentWeek[i] = null;
      }
    }
    weeks.push([...currentWeek]);
  }

  // Calculate statistics
  const stats = calculateBinaryGridStats(weeks);

  return {
    monthLabels,
    stats,
    weeks,
  };
}
