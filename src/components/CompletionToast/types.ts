/**
 * CompletionToast Types
 * Toast shown after successfully completing a habit
 */

import type { ViewStyle } from 'react-native';

export interface CompletionToastProps {
  /** Toast visibility */
  visible: boolean;
  /** Habit name */
  habitName: string;
  /** Current streak count */
  streak: number;
  /** Habit icon emoji */
  icon?: string;
  /** Auto-dismiss duration in ms (default: 2500) */
  duration?: number;
  /** On dismiss callback */
  onDismiss?: () => void;
  /** Custom style */
  style?: ViewStyle;
}

export interface CompletionToastData {
  habitName: string;
  streak: number;
  icon?: string;
}
