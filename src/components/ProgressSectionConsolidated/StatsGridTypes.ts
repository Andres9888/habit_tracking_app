/**
 * StatsGrid Types
 *
 * Type definitions for the StatsGrid component that displays
 * a compact 2x2 grid of key statistics with a strength ring.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import type { ProgressEmojiSet } from '../../utils/progressEmojis';

/**
 * Day information for best/focus day display
 */
export interface DayInfo {
  /** Day name (e.g., "Tuesday", "Saturday") */
  name: string;
  /** Completion rate as percentage (0-100) */
  rate: number;
}

/**
 * Individual stat item configuration
 */
export interface StatItemConfig {
  /** Unique identifier for the stat */
  id: 'streak' | 'monthly' | 'bestDay' | 'focusDay';
  /** Emoji icon */
  icon: string;
  /** Primary value to display */
  value: string;
  /** Label text */
  label: string;
  /** Background color (Tailwind class or hex) */
  backgroundColor: string;
  /** Optional trend indicator value */
  trend?: number;
  /** Whether to show trend indicator */
  showTrend?: boolean;
}

/**
 * Props for the main StatsGrid component
 */
export interface StatsGridProps {
  /** Current habit strength (0-100) */
  strength: number;
  /** Current streak in days */
  currentStreak: number;
  /** Days completed this month */
  monthlyCompleted: number;
  /** Total days in the month so far (up to today) */
  monthlyTotal: number;
  /** Best performing day of the week */
  bestDay: DayInfo | null;
  /** Worst performing day (focus day) needing attention */
  focusDay: DayInfo | null;
  /** Weekly change in strength percentage (for trend indicator) */
  weeklyChange?: number;
  /** Month-over-month change in completion count */
  monthlyChange?: number;
  /** Optional per-habit growth emoji override */
  progressEmojis?: ProgressEmojiSet;
  /** Callback when focus day is pressed */
  onFocusDayPress?: () => void;
}

/**
 * Props for the CompactStrengthRing component
 */
export interface CompactStrengthRingProps {
  /** Current strength value (0-100) */
  strength: number;
  /** Weekly change for trend badge */
  weeklyChange?: number;
  /** Optional per-habit growth emoji override */
  progressEmojis?: ProgressEmojiSet;
}

/**
 * Props for individual StatCard component
 */
export interface StatCardProps {
  /** Stat configuration */
  config: StatItemConfig;
  /** Animation index for staggered entrance */
  index: number;
  /** Whether motion is reduced (accessibility) */
  reduceMotion: boolean;
  /** Whether the card is interactive */
  isInteractive?: boolean;
  /** Callback when card is pressed */
  onPress?: () => void;
  /** Haptic feedback trigger */
  onHapticFeedback: () => void;
}

/**
 * Color configuration for stat cards
 */
export const STAT_CARD_COLORS: Record<
  StatItemConfig['id'],
  { bg: string; bgHex: string }
> = {
  bestDay: { bg: '', bgHex: '#ecfdf5' },
  focusDay: { bg: '', bgHex: '#fffbeb' },
  monthly: { bg: '', bgHex: '#f5f3ff' },
  streak: { bg: '', bgHex: '#fff7ed' },
};
