/**
 * Logistic Curve Calculations
 *
 * Provides baseline strength calculations using a logistic (S-curve) function.
 * This models the natural progression of habit formation over time, where:
 * - Early days: Slow growth (habit is new and unstable)
 * - Middle days: Rapid growth (habit is actively forming)
 * - Later days: Plateauing (habit approaches full strength)
 *
 * The curve is normalized so that it reaches 1.0 (100%) at LOGISTIC_TARGET_DAY.
 *
 * Mathematical formula:
 * ```
 * raw(x) = 1 / (1 + e^(-slope * (x - midpoint)))
 * normalized(x) = raw(x) / raw(target_day)
 * ```
 *
 * @module habitStrength/logistic
 */
import {
  LOGISTIC_MIDPOINT,
  LOGISTIC_SLOPE,
  LOGISTIC_TARGET_DAY,
} from './constants';
import { clamp } from './dateUtils';

/**
 * Raw logistic function without normalization.
 * Standard S-curve centered at LOGISTIC_MIDPOINT.
 *
 * @param daysSinceCreation - Number of days since habit was created
 * @returns Raw logistic value between 0 and 1 (not normalized)
 * @internal
 */
function logisticRaw(daysSinceCreation: number): number {
  return (
    1 /
    (1 + Math.exp(-LOGISTIC_SLOPE * (daysSinceCreation - LOGISTIC_MIDPOINT)))
  );
}

const LOGISTIC_TARGET_VALUE = logisticRaw(LOGISTIC_TARGET_DAY);

/**
 * Calculate normalized baseline strength using logistic curve.
 *
 * This represents the "expected" strength of a habit based purely on its age,
 * assuming perfect compliance. Actual strength is then adjusted by completion
 * rate and momentum factors.
 *
 * The curve is normalized so that:
 * - Day 0: ~0% strength (brand new habit)
 * - Day LOGISTIC_MIDPOINT: ~50% strength (halfway formed)
 * - Day LOGISTIC_TARGET_DAY: 100% strength (fully formed)
 * - After target day: Stays at 100%
 *
 * @param daysSinceCreation - Number of days since habit was created
 * @returns Baseline strength value between 0.0 and 1.0
 *
 * @example
 * ```ts
 * const baseline = logisticBaseline(30); // ~0.6 for 30-day-old habit
 * ```
 */
export function logisticBaseline(daysSinceCreation: number): number {
  if (daysSinceCreation >= LOGISTIC_TARGET_DAY) {
    return 1;
  }

  const raw = logisticRaw(daysSinceCreation);
  if (LOGISTIC_TARGET_VALUE === 0) {
    return clamp(raw, 0, 1);
  }

  return clamp(raw / LOGISTIC_TARGET_VALUE, 0, 1);
}
