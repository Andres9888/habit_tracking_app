/**
 * Container Props Types
 *
 * Props interfaces for main container and hero section components.
 */

import type { HabitTrackingEntry } from '../../../features/habits/types';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';
import type { QuickAction } from '../TipQuickActionsSheet';

/**
 * Props for the main ProgressSectionConsolidated container
 */
export interface ProgressSectionConsolidatedProps {
  /** Habit tracking entries */
  tracking: HabitTrackingEntry[];
  /** Timestamp when habit was created (ISO string) */
  habitCreatedAt: string;
  /** Current habit strength value (0-100) */
  strength: number;
  /** Weekly change in strength (positive = improving, negative = declining) */
  weeklyChange?: number;
  /** User-defined streak goal in days (e.g. 66). Omit to hide streak goal card. */
  streakGoal?: number;
  /** Optional per-habit growth emoji override */
  progressEmojis?: ProgressEmojiSet;
  /** Callback when info button is pressed */
  onInfoPress?: () => void;
  /** Callback when focus day chip is pressed */
  onFocusDayPress?: () => void;
  /** Callback when "See All" is pressed in weekly pattern section */
  onSeeAllPress?: () => void;
  /** Callback when actionable tip is pressed (legacy) */
  onTipPress?: () => void;
  /** Callback when a quick action is selected from the tip card */
  onTipQuickAction?: (action: QuickAction) => void;
}

/**
 * Props for HeroStrengthSection component
 * Displays the main progress ring with level info and trend indicator
 */
export interface HeroStrengthSectionProps {
  /** Current strength value (0-100) */
  strength: number;
  /** Weekly change in strength (positive = improving, negative = declining) */
  weeklyChange?: number;
  /** Callback when info button is pressed */
  onInfoPress?: () => void;
}
