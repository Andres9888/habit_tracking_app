/**
 * HabitDetailScreen Types
 * Type definitions for the habit detail screen
 */

import type { Id } from '../../../convex/_generated/dataModel';
import type {
  Habit as HabitDoc,
  HabitTrackingEntry,
} from '../../features/habits/types';

export type Habit = HabitDoc & {
  successRate?: number;
  totalCompletions?: number;
  totalMisses?: number;
};

export interface WeekDayData {
  completed: boolean;
  date: string;
  isToday: boolean;
}

export interface HabitDetailScreenProps {
  habit: Habit | null;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  onEdit?: (habit: Habit) => void;
  onOpenCalendar?: (habit: Habit) => void;
  onPause?: (habitId: Id<'habits'>) => void;
  tracking?: HabitTrackingEntry[];
  visible: boolean;
}

export interface UseHabitDetailScreenStateReturn {
  completedDates: Set<string>;
  daysTracking: number;
  isCompletedToday: boolean;
  isTogglingCalendar: boolean;
  pendingArchive: boolean;
  pendingDelete: boolean;
  setIsTogglingCalendar: (toggling: boolean) => void;
  setPendingArchive: (pending: boolean) => void;
  setPendingDelete: (pending: boolean) => void;
  strengthPercent: number;
  today: string;
  totalCompletions: number;
}
