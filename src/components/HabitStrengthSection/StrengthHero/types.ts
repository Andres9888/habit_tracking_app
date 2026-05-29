/**
 * StrengthHero Component - Type Definitions
 */

import type { SharedValue } from 'react-native-reanimated';

import type { StrengthLabel } from '../../HabitStrengthHistory/types';

/**
 * Props for the StrengthHero component.
 */
export interface StrengthHeroProps {
  /** Current strength percentage (0-100) */
  strength: number;

  /** Strength label (weak/developing/strong) */
  label: StrengthLabel;

  /** Change vs previous period (e.g., "+12%") */
  delta: number;

  /** Delta comparison period label (e.g., "vs last month") */
  deltaLabel: string;

  /** Optional custom color override */
  color?: string;

  /** 5-tier display label (e.g. Unbreakable); overrides STRENGTH_LABELS when set */
  tierDisplayLabel?: string;
}

/**
 * Props for the AnimatedPercentage component.
 */
export interface AnimatedPercentageProps {
  animatedValue: SharedValue<number>;
}

/**
 * Props for the ProgressRing component.
 */
export interface ProgressRingProps {
  roundedStrength: number;
  ringColor: string;
  animatedStrength: SharedValue<number>;
}

/**
 * Props for the StatusDisplay component.
 */
export interface StatusDisplayProps {
  label: StrengthLabel;
  delta: number;
  deltaLabel: string;
  tierDisplayLabel?: string;
}
