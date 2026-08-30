/**
 * MonthlyCalendarGrid Types
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type {
  HabitDayContext,
  HabitDayState,
} from '../../../features/habits/habitDayState';

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
  state: HabitDayState;
}

export interface MonthlyCalendarGridProps {
  habitId: Id<'habits'>;
  completedDates: Set<string>;
  dayContext?: HabitDayContext;
  habitColor: string;
  /** Controlled month — when set, grid follows this date. */
  currentMonth?: Date;
  onCurrentMonthChange?: (month: Date) => void;
  /** Solid habit-color fills for completed days (detail screen). */
  useSolidCompletedFill?: boolean;
  /** When false, hide the month insight strip (History has its own legend). */
  showStreakInInsights?: boolean;
  pendingToggleDate?: string | null;
  onDayPress?: (date: string, completed: boolean) => void;
  /** Suppress the own card background/border/shadow/padding when embedded
   *  inside a parent card (e.g. the unified Habit Detail calendar card). */
  bare?: boolean;
  /** Hide the built-in month bar so a parent can render it above the card. */
  hideNavigation?: boolean;
}
