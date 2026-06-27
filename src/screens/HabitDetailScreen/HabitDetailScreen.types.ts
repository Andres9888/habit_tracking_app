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
  editOverlay?: React.ReactNode;
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
  isCompletedToday: boolean;
  pendingArchive: boolean;
  pendingDelete: boolean;
  pendingToggleDate: string | null;
  setPendingArchive: (pending: boolean) => void;
  setPendingDelete: (pending: boolean) => void;
  setPendingToggleDate: (date: string | null) => void;
  strengthPercent: number;
  today: string;
  totalCompletions: number;
}
