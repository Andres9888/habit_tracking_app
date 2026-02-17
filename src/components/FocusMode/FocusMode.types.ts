/**
 * FocusMode Types
 * Type definitions for the FocusMode component
 */

import type { Id } from '../../../convex/_generated/dataModel';

export interface FocusModeProps {
  /** Habit ID */
  habitId: Id<'habits'>;

  /** Habit name */
  habitName: string;

  /** Habit icon/emoji */
  habitIcon?: string;

  /** Habit color */
  habitColor?: string;

  /** Whether habit is already completed */
  completed?: boolean;

  /** Pomodoro timer duration in minutes (default: 25) */
  timerDuration?: number;

  /** Enable timer (default: true) */
  enableTimer?: boolean;

  /** On complete handler */
  onComplete?: () => void;

  /** On dismiss handler */
  onDismiss?: () => void;
}
