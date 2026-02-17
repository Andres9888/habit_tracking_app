/**
 * MonthlyCalendarGrid Types
 */

import type { Id } from '../../../../convex/_generated/dataModel';

export interface VacationPeriod {
  end: string;
  start: string;
}

export interface DayData {
  date: Date;
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  isBeforeCreation: boolean;
  isCompleted: boolean;
  /** Whether this day was a missed day (should have been tracked but wasn't) */
  isMissed: boolean;
  /** True when this date falls within a vacation period (Streak Insurance) */
  isVacation: boolean;
}

export interface MonthlyCalendarGridProps {
  habitId: Id<'habits'>;
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
  /** Map of date strings to note bodies for showing notes on day tap */
  notesByDate?: Record<string, string>;
  /** Vacation periods for streak insurance (premium) */
  vacationPeriods?: VacationPeriod[];
  onDayPress?: (date: string, completed: boolean) => void;
}
