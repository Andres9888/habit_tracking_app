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

  /** Change over the trailing 7 days */
  deltaVsWeek: number;

  /** Change over the trailing 30 days */
  deltaVsMonth: number;
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
  label: StrengthLabel;
}

/**
 * Props for the StatusDisplay component.
 */
export interface StatusDisplayProps {
  label: StrengthLabel;
  deltaVsWeek: number;
  deltaVsMonth: number;
}
