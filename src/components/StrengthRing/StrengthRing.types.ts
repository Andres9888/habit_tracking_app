/**
 * StrengthRing Type Definitions
 */

import type { PartialProgressEmojiSet } from '@/utils/progressEmojis';

export interface StrengthRingProps {
  /** Strength value (0-100) */
  strength: number;
  /**
   * Ring size variant
   * - tiny: 32px diameter (for compact habit cards)
   * - small: 48px diameter (for habit cards)
   * - medium: 72px diameter (for detail screens)
   * - large: 96px diameter (for hero displays)
   */
  size?: 'tiny' | 'small' | 'medium' | 'large';
  /** Show percentage text in center of ring */
  showPercentage?: boolean;
  /** Show level emoji in center (overrides percentage if both true) */
  showEmoji?: boolean;
  /** Show level label below ring */
  showLevel?: boolean;
  /** Trend indicator: 'up', 'down', 'stable', or undefined to hide */
  trend?: 'up' | 'down' | 'stable';
  /** Weekly change percentage (shown next to percentage) */
  weeklyChange?: number;
  /** Per-stage emoji overrides (per-habit or user default) */
  emojiOverrides?: PartialProgressEmojiSet;
}

export interface LevelInfo {
  color: string;
  colorLight: string;
  emoji: string;
  label: string;
}

export interface SizeConfig {
  fontSize: number;
  ringSize: number;
  strokeWidth: number;
}
