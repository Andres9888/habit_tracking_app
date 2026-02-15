/**
 * Types for DontBreakTheChain nudge component
 */

export interface DontBreakTheChainProps {
  /** Current streak count */
  currentStreak: number;

  /** Habit name for personalization */
  habitName?: string;

  /** Minimum streak to show nudge (default: 3) */
  minStreak?: number;

  /** Whether to reduce motion */
  reduceMotion?: boolean;

  /** Whether habits are already completed today */
  completedToday?: boolean;
}
