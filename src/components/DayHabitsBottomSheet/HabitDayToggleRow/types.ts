import type { Habit } from '../../../features/habits/types';

export interface HabitDayToggleRowProps {
  /** The habit to display */
  habit: Habit;
  /** Whether this habit is completed on the selected date */
  isCompleted: boolean;
  /** Callback when the toggle is pressed */
  onToggle: () => Promise<void>;
  /** Whether the toggle is currently loading */
  isLoading?: boolean;
  /** Whether to reduce motion for animations */
  reduceMotion?: boolean;
}
