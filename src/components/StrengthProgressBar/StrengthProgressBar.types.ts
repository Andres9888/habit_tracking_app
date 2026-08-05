/**
 * StrengthProgressBar Types
 */

import type { PartialProgressEmojiSet } from '@/utils/progressEmojis';

export interface StrengthProgressBarProps {
  /** Strength value (0-100) */
  strength: number;
  /** Size variant */
  size?: 'compact' | 'default' | 'large';
  /** Show dividers at level thresholds */
  showDividers?: boolean;
  /** Show level emoji */
  showEmoji?: boolean;
  /** Show level label text */
  showLabel?: boolean;
  /** Show next level hint */
  showNextLevel?: boolean;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Per-stage emoji overrides (per-habit or user default) */
  emojiOverrides?: PartialProgressEmojiSet;
}

export interface LevelConfig {
  color: string;
  colorBg: string;
  emoji: string;
  label: string;
  threshold: number;
}

export interface SizeConfig {
  barHeight: number;
  emojiContainerSize: number;
  emojiSize: number;
  fontSize: number;
  gap: number;
}
