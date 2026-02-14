/**
 * StreakCalendar Types
 */

import type { Id, Doc } from '../../../convex/_generated/dataModel';

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

export interface StreakCalendarProps {
  habitId: Id<'habits'>;
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
  notes?: Doc<'notes'>[];
}

export interface UseStreakCalendarDaysProps {
  completedDates: Set<string>;
  currentMonth: Date;
  habitCreatedAt?: number;
}

export interface UseStreakCalendarDaysReturn {
  weeks: (DayData | null)[][];
}
