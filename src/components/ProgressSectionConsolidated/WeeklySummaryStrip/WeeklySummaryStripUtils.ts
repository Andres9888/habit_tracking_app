/**
 * WeeklySummaryStrip Utility Functions
 *
 * Helper functions for determining visual states and trends.
 */

import { ArrowDown, ArrowUp, Minus } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { parseDateKeyLocal } from '../../../utils/getLocalDateString';
import type {
  WeekDayData,
  DayVisualState,
  TrendDirection,
} from '../WeeklySummaryStripTypes';

/**
 * Determines the visual state for a day cell
 */
export function getDayVisualState(
  day: WeekDayData,
  today: Date
): DayVisualState {
  const dayDate = parseDateKeyLocal(day.date);
  dayDate.setHours(0, 0, 0, 0);
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
 * Get trend icon component
 */
export function getTrendIcon(direction: TrendDirection): LucideIcon {
  switch (direction) {
    case 'up': {
      return ArrowUp;
    }
    case 'down': {
      return ArrowDown;
    }
    case 'same': {
      return Minus;
    }
  }
}

/**
 * Get trend color
 */
export function getTrendColor(
  direction: TrendDirection,
  successColor?: string
): string {
  switch (direction) {
    case 'up': {
      return successColor ?? '#10b981';
    }
    case 'down': {
      return '#ef4444';
    } // red-500
    case 'same': {
      return '#78716c';
    } // stone-500
  }
}
