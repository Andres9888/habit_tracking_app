/**
 * WeeklySummaryStrip Utility Functions
 *
 * Helper functions for determining visual states and trends.
 */

import type {
  WeekDayData,
  DayVisualState,
  TrendDirection,
  IconName,
} from '../WeeklySummaryStripTypes';

/**
 * Determines the visual state for a day cell
 */
export function getDayVisualState(
  day: WeekDayData,
  today: Date
): DayVisualState {
  // Parse YYYY-MM-DD as local date (not UTC) to avoid off-by-one timezone bugs
  const [year, month, dayNum] = day.date.split('-').map(Number);
  const dayDate = new Date(year, month - 1, dayNum);
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  if (day.isToday) {
    return day.completed ? 'todayComplete' : 'todayIncomplete';
  }

  if (dayDate > todayStart) {
    return 'future';
  }

  return day.completed ? 'complete' : 'missed';
}

/**
 * Calculates the trend direction based on current vs last week completion
 */
export function getTrendDirection(
  currentWeekCompleted: number,
  lastWeekCompleted: number
): TrendDirection {
  if (currentWeekCompleted > lastWeekCompleted) return 'up';
  if (currentWeekCompleted < lastWeekCompleted) return 'down';
  return 'same';
}

/**
 * Get trend icon name
 */
export function getTrendIcon(direction: TrendDirection): IconName {
  switch (direction) {
    case 'up': {
      return 'arrow-up';
    }
    case 'down': {
      return 'arrow-down';
    }
    case 'same': {
      return 'remove';
    }
  }
}

/**
 * Get trend color
 */
export function getTrendColor(direction: TrendDirection): string {
  switch (direction) {
    case 'up': {
      return '#10b981';
    } // emerald-500
    case 'down': {
      return '#ef4444';
    } // red-500
    case 'same': {
      return '#78716c';
    } // stone-500
  }
}
