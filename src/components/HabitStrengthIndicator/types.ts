/**
 * HabitStrengthIndicator Type Definitions
 * Based on UX Specification Section 4.2
 */

import type { PartialProgressEmojiSet } from '@/utils/progressEmojis';

export type StrengthLevel =
  | 'starting'
  | 'building'
  | 'developing'
  | 'strong'
  | 'automatic';

export type StrengthVariant = 'compact' | 'full' | 'graph';

export interface StrengthLevelConfig {
  emoji: string;
  label: string;
  description: string;
  minThreshold: number;
  maxThreshold: number;
}

export interface HabitStrengthIndicatorProps {
  /** Strength value (0-100 scale) */
  strength: number;

  /** Optional override for strength level */
  strengthLevel?: StrengthLevel;

  /** Display variant */
  variant?: StrengthVariant;

  /** Show percentage number */
  showPercentage?: boolean;

  /** Show label text (Full variant only) */
  showLabel?: boolean;

  /** Habit name for accessibility */
  habitName?: string;

  /** Historical data for graph variant (array of strength values over time) */
  historicalData?: number[];

  /** Per-stage emoji overrides (per-habit or user default) */
  emojiOverrides?: PartialProgressEmojiSet;
}

/** Props for individual variant components */
export interface IndicatorVariantProps {
  strength: number;
  level: StrengthLevel;
  config: StrengthLevelConfig;
  showPercentage: boolean;
  showLabel?: boolean;
  getStrengthColor: () => string;
  progressBarStyle: object;
  emojiStyle: object;
}
