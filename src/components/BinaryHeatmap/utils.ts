/**
 * BinaryHeatmap Utilities
 *
 * Grid generation and helper functions for the GitHub-style binary heatmap.
 * This module provides functions to generate the grid data structure,
 * calculate statistics, and format dates for display.
 */

import {
  format,
  parseISO,
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
  BinaryGridStats,
  BinaryCellState,
} from './types';
import { TIME_RANGE_CONFIG, DAY_NAMES_FULL } from './constants';

/**
 * Get the number of days for a given time range
 */
export function getTimeRangeDays(timeRange: TimeRange): number {
  return TIME_RANGE_CONFIG[timeRange].days;
}

/**
 * Determine the cell state based on day properties
 */
export function getCellState(day: BinaryDay): BinaryCellState {
  if (day.isBeforeCreation) {
    return 'beforeCreation';
  }
  if (day.isFuture) {
    return 'future';
  }
  if (day.isToday) {
    return 'today';
  }
  return day.completed ? 'done' : 'missed';
}

/**
 * Generate the binary heatmap grid for a given time range
 *
 * The grid is organized as an array of weeks, where each week contains 7 days
 * (Sunday through Saturday). Days outside the time range are null.
 *
 * @param timeRange - The time range to display ('3m', '6m', or '1y')
 * @param completedDates - Set of dates in YYYY-MM-DD format that have completions
 * @param habitCreatedAt - Optional Unix timestamp of when the habit was created
 * @param currentDate - Optional reference date (defaults to today, useful for testing)
 * @returns Grid data including weeks array, month labels, and statistics
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
    const isBeforeCreation = habitCreatedDate
      ? isBefore(iterDate, habitCreatedDate) &&
        !isSameDay(iterDate, habitCreatedDate)
      : false;

    // Track month changes for labels (only for dates in range)
    if (isInRange) {
      const currentMonth = iterDate.getMonth();
      if (currentMonth !== lastMonth) {
        monthLabels.push({
          label: format(iterDate, 'MMM'),
          weekIndex, // Short month name: "Oct", "Nov", etc.
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

/**
 * Calculate statistics for a binary grid
 *
 * @param weeks - The grid weeks array
 * @returns Statistics including completions, eligible days, and completion rate
 */
export function calculateBinaryGridStats(
  weeks: (BinaryDay | null)[][]
): BinaryGridStats {
  let completions = 0;
  let eligibleDays = 0;

  for (const week of weeks) {
    for (const day of week) {
      // Skip null (padding) cells
      if (day === null) continue;

      // Skip cells that are not eligible (before creation or future)
      if (day.isBeforeCreation || day.isFuture) continue;

      eligibleDays++;
      if (day.completed) {
        completions++;
      }
    }
  }

  const completionRate =
    eligibleDays > 0 ? Math.round((completions / eligibleDays) * 100) : 0;

  return {
    completionRate,
    completions,
    eligibleDays,
  };
}

/**
 * Format a date string for accessibility
 *
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Human-readable date string (e.g., "Saturday, December 20, 2025")
 */
export function formatDateForAccessibility(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Generate accessibility label for a binary cell
 *
 * @param day - The day data (or null for empty cells)
 * @returns Accessibility label string
 */
export function getBinaryCellAccessibilityLabel(day: BinaryDay | null): string {
  if (day === null) {
    return 'Empty cell';
  }

  const formattedDate = formatDateForAccessibility(day.date);
  const dayOfWeek = parseISO(day.date).getDay();
  const dayName = DAY_NAMES_FULL[dayOfWeek];

  if (day.isBeforeCreation) {
    return `${dayName}, ${formattedDate}. Before habit tracking started`;
  }

  if (day.isFuture) {
    return `${dayName}, ${formattedDate}. Future date`;
  }

  const completionStatus = day.completed ? 'Completed' : 'Not completed';
  const todayIndicator = day.isToday ? 'Today, ' : '';

  return `${todayIndicator}${dayName}, ${formattedDate}. ${completionStatus}`;
}

/**
 * Format tooltip text for a day cell
 *
 * @param day - The day data
 * @returns Tooltip text (e.g., "Dec 15: Done ✓")
 */
export function formatTooltipText(day: BinaryDay): string {
  const date = parseISO(day.date);
  const formattedDate = format(date, 'MMM d');

  if (day.isToday) {
    return `${formattedDate}: Today`;
  }

  if (day.isFuture) {
    return `${formattedDate}: Future`;
  }

  if (day.isBeforeCreation) {
    return `${formattedDate}: Before tracking`;
  }

  return day.completed
    ? `${formattedDate}: Done ✓`
    : `${formattedDate}: Missed`;
}

/**
 * Get the total number of cells in the grid (including nulls)
 * Useful for calculating animation delays
 *
 * @param weeks - The grid weeks array
 * @returns Total cell count
 */
export function getTotalCellCount(weeks: (BinaryDay | null)[][]): number {
  return weeks.reduce((total, week) => total + week.length, 0);
}

/**
 * Calculate animation delay for a cell based on its position
 *
 * @param weekIndex - Index of the week (column)
 * @param dayIndex - Index of the day within the week (row)
 * @param staggerDelay - Base delay between cells in ms
 * @returns Delay in milliseconds
 */
export function calculateCellAnimationDelay(
  weekIndex: number,
  dayIndex: number,
  staggerDelay: number = 5
): number {
  // Animate left-to-right, top-to-bottom
  // Each column (week) animates slightly after the previous
  // Within a column, days animate from top (Sunday) to bottom (Saturday)
  const linearIndex = weekIndex * 7 + dayIndex;
  return linearIndex * staggerDelay;
}

/**
 * Check if a date string is valid
 *
 * @param dateStr - Date string to validate
 * @returns True if the date is valid YYYY-MM-DD format
 */
export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }

  const date = parseISO(dateStr);
  return !Number.isNaN(date.getTime());
}

/**
 * Convert a Date to YYYY-MM-DD format
 *
 * @param date - Date object to convert
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
