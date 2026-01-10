/**
 * Logistic Curve Calculations
 * Baseline strength curve based on habit age
 */
import {
  LOGISTIC_MIDPOINT,
  LOGISTIC_SLOPE,
  LOGISTIC_TARGET_DAY,
} from './constants';
import { clamp } from './dateUtils';

function logisticRaw(daysSinceCreation: number): number {
  return (
    1 /
    (1 + Math.exp(-LOGISTIC_SLOPE * (daysSinceCreation - LOGISTIC_MIDPOINT)))
  );
}

const LOGISTIC_TARGET_VALUE = logisticRaw(LOGISTIC_TARGET_DAY);

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
