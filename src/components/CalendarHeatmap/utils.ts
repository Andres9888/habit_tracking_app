/**
 * CalendarHeatmap Utilities
 * Grid generation and date helpers
 */

import { format, startOfMonth, endOfMonth, getDay, getDaysInMonth, isSameDay, isAfter, isBefore, parseISO } from 'date-fns';

/**
 * Represents a single day in the calendar grid
 */
export interface CalendarDay {
  /** Date string in YYYY-MM-DD format, null for padding cells */
  date: string | null;
  /** Day of month (1-31) */
  dayOfMonth: number | null;
  /** Whether the habit was completed on this day */
  completed: boolean;
  /** Whether this is today */
  isToday: boolean;
  /** Whether this is a future date */
  isFuture: boolean;
  /** Whether this date is before the habit was created */
  isBeforeCreation: boolean;
}

/**
 * Generates a calendar grid for a given month
 * Returns an array of weeks, each containing 7 days (Sunday to Saturday)
 */
export function generateMonthGrid(
  year: number,
  month: number, // 0-indexed (0 = January)
  completedDates: Set<string>,
  habitCreatedAt?: number
): CalendarDay[][] {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const firstDay = startOfMonth(new Date(year, month));
  const lastDay = endOfMonth(new Date(year, month));
  const startPadding = getDay(firstDay); // 0 = Sunday
  const daysInMonth = getDaysInMonth(firstDay);

  const habitCreatedDate = habitCreatedAt ? new Date(habitCreatedAt) : null;

  const grid: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  // Add padding for days before the 1st of the month
  for (let i = 0; i < startPadding; i++) {
    currentWeek.push({
      date: null,
      dayOfMonth: null,
      completed: false,
      isToday: false,
      isFuture: false,
      isBeforeCreation: false,
    });
  }

  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = format(date, 'yyyy-MM-dd');
    const isToday = dateStr === todayStr;
    const isFuture = isAfter(date, today) && !isToday;
    const isBeforeCreation = habitCreatedDate ? isBefore(date, habitCreatedDate) && !isSameDay(date, habitCreatedDate) : false;

    currentWeek.push({
      date: dateStr,
      dayOfMonth: day,
      completed: completedDates.has(dateStr),
      isToday,
      isFuture,
      isBeforeCreation,
    });

    if (currentWeek.length === 7) {
      grid.push(currentWeek);
      currentWeek = [];
    }
  }

  // Pad final week with empty cells
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: null,
        dayOfMonth: null,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      });
    }
    grid.push(currentWeek);
  }

  return grid;
}

/**
 * Calculate month summary statistics
 */
export function calculateMonthStats(
  grid: CalendarDay[][],
  month: number,
  year: number
): { completions: number; eligibleDays: number; successRate: number } {
  const today = new Date();
  let completions = 0;
  let eligibleDays = 0;

  for (const week of grid) {
    for (const day of week) {
      if (day.date && !day.isBeforeCreation && !day.isFuture) {
        eligibleDays++;
        if (day.completed) {
          completions++;
        }
      }
    }
  }

  const successRate = eligibleDays > 0 ? (completions / eligibleDays) * 100 : 0;

  return { completions, eligibleDays, successRate };
}

/**
 * Day of week labels
 */
export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * Full day of week names for accessibility
 */
export const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Format a date string for accessibility (e.g., "Saturday, December 20, 2025")
 */
export function formatDateForAccessibility(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Generate accessibility label for a calendar day
 */
export function getDayAccessibilityLabel(day: CalendarDay): string {
  if (day.date === null) {
    return 'Empty cell';
  }

  const formattedDate = formatDateForAccessibility(day.date);

  if (day.isBeforeCreation) {
    return `${formattedDate}. Before habit tracking started`;
  }

  if (day.isFuture) {
    return `${formattedDate}. Future date`;
  }

  const completionStatus = day.completed ? 'Completed' : 'Not completed';
  const todayIndicator = day.isToday ? 'Today, ' : '';

  return `${todayIndicator}${formattedDate}. ${completionStatus}`;
}

/**
 * Day-of-week statistics interface
 */
export interface DayOfWeekStat {
  day: string;
  rate: number;
  count: number;
  total: number;
}

/**
 * Calculate completion rate by day of week
 */
export function calculateDayOfWeekStats(
  completedDates: Set<string>,
  habitCreatedAt?: number
): DayOfWeekStat[] {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const stats = Array(7).fill(0).map((_, i) => ({
    day: dayNames[i],
    count: 0,
    total: 0,
    rate: 0,
  }));

  const startDate = habitCreatedAt ? new Date(habitCreatedAt) : new Date();
  const endDate = new Date();

  // Iterate through each day from habit creation to today
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const dateStr = format(d, 'yyyy-MM-dd');

    stats[dayOfWeek].total++;
    if (completedDates.has(dateStr)) {
      stats[dayOfWeek].count++;
    }
  }

  // Calculate rates
  stats.forEach(stat => {
    stat.rate = stat.total > 0 ? Math.round((stat.count / stat.total) * 100) : 0;
  });

  return stats;
}

/**
 * Detect weakest day pattern
 * Returns the day that's significantly below average (>20% gap)
 */
export function detectWeakDay(
  dayStats: DayOfWeekStat[]
): { day: string; rate: number } | null {
  const avgRate = dayStats.reduce((sum, s) => sum + s.rate, 0) / 7;

  // Find day that's >20% below average
  const weak = dayStats
    .filter(s => s.rate < avgRate - 20)
    .sort((a, b) => a.rate - b.rate)[0];

  return weak ? { day: weak.day, rate: weak.rate } : null;
}
