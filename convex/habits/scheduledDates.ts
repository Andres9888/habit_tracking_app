/**
 * Scheduled Dates Utility
 *
 * Generates a set of scheduled dates for a calendar view based on habit frequency.
 */

import { startOfDay, endOfDay, eachDayOfInterval, addDays, format } from 'date-fns';
import type { FrequencyConfig } from './frequency';
import { parseFrequencyConfig, isHabitScheduledForDate } from './frequency';

/**
 * Get scheduled dates for a date range
 */
export function getScheduledDatesForRange(params: {
  habitFrequencyConfig?: string;
  startDate: Date;
  endDate: Date;
}): Set<string> {
  const { habitFrequencyConfig, startDate, endDate } = params;

  const frequencyConfig = habitFrequencyConfig
    ? parseFrequencyConfig(habitFrequencyConfig)
    : { type: 'daily' as const };

  const scheduledDates = new Set<string>();

  // For daily, all days are scheduled
  if (frequencyConfig.type === 'daily') {
    const days = eachDayOfInterval({
      start: startOfDay(startDate),
      end: endOfDay(endDate),
    });
    days.forEach((day) => {
      scheduledDates.add(format(day, 'yyyy-MM-dd'));
    });
    return scheduledDates;
  }

  // For other types, check each day
  const days = eachDayOfInterval({
    start: startOfDay(startDate),
    end: endOfDay(endDate),
  });

  days.forEach((day) => {
    if (isHabitScheduledForDate(frequencyConfig, day)) {
      scheduledDates.add(format(day, 'yyyy-MM-dd'));
    }
  });

  return scheduledDates;
}
