/**
 * NextHabitSuggestion Types
 */

export interface HabitData {
  _id: string;
  name: string;
  icon?: string;
}

export interface NextHabitSuggestionProps {
  /** The next incomplete habit to focus on (null if all complete) */
  habit: HabitData | null;
  /** Callback when the habit card is pressed */
  onPress?: (habit: HabitData) => void;
  /** Number of completed habits today */
  completedCount: number;
  /** Total number of habits */
  totalCount: number;
}
