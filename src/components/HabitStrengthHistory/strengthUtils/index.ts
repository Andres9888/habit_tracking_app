/**
 * Habit Strength Utility Functions
 *
 * Provides calculation and formatting utilities for habit strength
 * using an exponential smoothing algorithm (Loop Habit Tracker style).
 *
 * Key Concepts:
 * - Strength grows on completions: strength + (1 - strength) * GROWTH_RATE
 * - Strength decays on misses: strength * DECAY_RATE
 * - Thresholds: 0-29% weak, 30-69% developing, 70-100% strong
 *
 * @see habit-strength-history-spec.md Section 3
 */

export { calculateStrengthAtDate } from './calculation';
export {
  ALGORITHM_MODE_CONFIGS,
  DEFAULT_DECAY_RATE,
  DEFAULT_GROWTH_RATE,
  DEFAULT_MAX_SAMPLE_POINTS,
  STRENGTH_COLOR_MAP,
  STRONG_THRESHOLD,
  WEAK_THRESHOLD,
} from './constants';
export { formatDateString } from './formatting';
export {
  getStrengthColor,
  getStrengthColors,
  getStrengthLabel,
} from './labels';
export {
  calculateCompletionRate,
  calculateDelta,
  calculateStrengthExtremes,
  isPerfectStreak,
} from './statistics';
export { generateStrengthTimeline } from './timeline';
