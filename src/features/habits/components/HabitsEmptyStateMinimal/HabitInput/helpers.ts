/**
 * Helper functions for HabitInput
 */

import { CHARACTER_LIMIT } from '../constants';

/**
 * Get character counter color based on length.
 * Thresholds derived from centralized constants in @/constants/app.ts.
 */
export function getCharacterCounterColor(
  length: number,
  normalColor: string,
  warningColor: string,
  errorColor: string
): string {
  if (length >= CHARACTER_LIMIT.errorThreshold) {
    return errorColor;
  }
  if (length >= CHARACTER_LIMIT.warningThreshold) {
    return warningColor;
  }
  return normalColor;
}
