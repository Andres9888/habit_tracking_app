/**
 * Legacy Klein Model Formulas
 * Klein et al. (2011) habit strength and memory accessibility calculations
 * Kept for backwards compatibility
 */
import {
  CONTEXT_CONSISTENCY,
  DEFAULT_ACCESSIBILITY_DECAY_PARAM,
  DEFAULT_ACCESSIBILITY_GAIN_BEHAVIOR,
  DEFAULT_ACCESSIBILITY_GAIN_REMINDER,
  DEFAULT_HABIT_DECAY_PARAM,
  DEFAULT_HABIT_GAIN_PARAM,
} from './constants';

/**
 * Calculate habit strength using Klein et al. (2011) equation
 */
export function calculateHabitStrength(
  currentStrength: number,
  behaviorPerformed: boolean,
  habitDecayParam: number = DEFAULT_HABIT_DECAY_PARAM,
  habitGainParam: number = DEFAULT_HABIT_GAIN_PARAM
): number {
  const HS = Math.max(0, Math.min(1, currentStrength));
  const Beh = behaviorPerformed ? 1 : 0;
  const Cue = CONTEXT_CONSISTENCY;

  const decay = HS * habitDecayParam;
  const gain = (1 - HS) * Beh * Cue * habitGainParam;
  const newStrength = HS - decay + gain;

  return Math.max(0, Math.min(1, newStrength));
}

/**
 * Calculate memory accessibility using Tobias (2009) equation
 */
export function calculateMemoryAccessibility(
  currentAccessibility: number,
  behaviorPerformed: boolean,
  reminderReceived: boolean,
  accessibilityDecayParam: number = DEFAULT_ACCESSIBILITY_DECAY_PARAM,
  accessibilityGainBehavior: number = DEFAULT_ACCESSIBILITY_GAIN_BEHAVIOR,
  accessibilityGainReminder: number = DEFAULT_ACCESSIBILITY_GAIN_REMINDER
): number {
  const Acc = Math.max(0, Math.min(1, currentAccessibility));
  const Beh = behaviorPerformed ? 1 : 0;
  const Rem = reminderReceived ? 1 : 0;

  const decay = Acc * accessibilityDecayParam;
  const gain =
    (1 - Acc) *
    (Beh * accessibilityGainBehavior + Rem * accessibilityGainReminder);
  const newAccessibility = Acc - decay + gain;

  return Math.max(0, Math.min(1, newAccessibility));
}

/**
 * Calculate predicted probability of future behavior completion
 */
export function predictCompletionProbability(
  habitStrength: number,
  accessibility: number = 1
): number {
  const baseProbability = 0.3;
  const strengthBonus = habitStrength * 0.5;
  const accessibilityMultiplier = 0.5 + accessibility * 0.5;
  const probability =
    (baseProbability + strengthBonus) * accessibilityMultiplier;
  return Math.min(0.95, Math.max(0.05, probability));
}
