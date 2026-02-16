/**
 * Helper functions for HabitInput
 */

import { CHARACTER_LIMIT } from '../constants';

/**
 * Get character counter color based on length
 * - Default: under warning threshold
 * - Warning: 35+ characters
 * - Error: 45+ characters
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
