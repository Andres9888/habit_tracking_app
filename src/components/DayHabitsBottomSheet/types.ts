import type { Id } from '../../../convex/_generated/dataModel';
import type { Habit, HabitStatus } from '../../features/habits/types';

/**
 * Props for DayHabitsBottomSheet component
 */
export interface DayHabitsBottomSheetProps {
  /** The selected date to show habits for */
  date: Date | null;
  /** Whether the sheet is visible */
  visible: boolean;
  /** Callback when the sheet should close */
  onClose: () => void;
  /** List of all habits */
  habits: Habit[];
  /** Get completion status for a habit on a specific date */
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  /** Toggle habit completion for a specific date */
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<unknown>;
  /** Whether to reduce motion for animations */
  reduceMotion?: boolean;
}

/**
 * Internal state for the bottom sheet
 */
export interface SheetState {
  togglingHabitId: string | null;
  setTogglingHabitId: (id: string | null) => void;
}

/**
 * Date information computed from the selected date
 */
export interface DateInfo {
  dateString: string;
  displayDate: string;
  isToday: boolean;
  isPast: boolean;
}
