/**
 * Type definitions for StreakIndicator component
 */

export interface StreakIndicatorProps {
  /** Current consecutive days streak */
  currentStreak: number;

  /** All-time best streak */
  bestStreak: number;

  /** Compact view for list or full view for detail */
  compact?: boolean;

  /** Callback when milestone is reached (for celebration effects) */
  onMilestone?: (streak: number) => void;

  /** Accessibility label override */
  accessibilityLabel?: string;
}

export type Milestone = 7 | 30 | 100;

export interface MilestoneBadge {
  color: string;
  emoji: string;
  label: string;
}
