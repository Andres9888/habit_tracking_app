/**
 * Types for MilestoneCelebration component
 */

import type { StrengthLevel } from '../HabitStrengthIndicator';

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

}

export interface AnimationValues {
  badgeScale: { value: number };
  glowOpacity: { value: number };
  labelOpacity: { value: number };
  percentageValue: { value: number };
  continueButtonOpacity: { value: number };
}
