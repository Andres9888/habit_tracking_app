/**
 * Types for MilestoneCelebration component
 */

import type { StrengthLevel } from '../HabitStrengthIndicator/HabitStrengthIndicator';

export interface MilestoneCelebrationProps {
  /** Modal visibility */
  visible: boolean;

  /** On close callback */
  onClose: () => void;

  /** Strength level achieved */
  level: StrengthLevel;

  /** Current strength percentage */
  strength: number;

  /** Habit name for context */
  habitName: string;

  /** On share callback */
  onShare?: () => void;
}

export interface AnimationValues {
  badgeScale: { value: number };
  glowOpacity: { value: number };
  labelOpacity: { value: number };
  percentageValue: { value: number };
  shareButtonTranslateY: { value: number };
  shareButtonOpacity: { value: number };
  continueButtonOpacity: { value: number };
}
