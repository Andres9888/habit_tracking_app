/**
 * StrengthHero Component - Type Definitions
 */

import type { SharedValue } from 'react-native-reanimated';

import type { StrengthJourney } from '../journey';

/**
 * Props for the StrengthHero component.
 */
export interface StrengthHeroProps {
  /** Current strength percentage (0-100) */
  strength: number;

  /** Resolved journey (current level, next level, progress) with user emojis */
  journey: StrengthJourney;
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
  /** Accessible stage name (e.g. "Strong") */
  label: string;
}
