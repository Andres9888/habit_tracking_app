/**
 * MonthlyCalendarGrid Types
 */

import type { Id } from '../../../../convex/_generated/dataModel';

export interface DayData {
  date: Date;
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  isBeforeCreation: boolean;
  isCompleted: boolean;
}

export interface MonthlyCalendarGridProps {
  habitId: Id<'habits'>;
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
  onDayPress?: (date: string, completed: boolean) => void;
}
