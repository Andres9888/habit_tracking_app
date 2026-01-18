/**
 * Helper functions for HabitInput
 */

import { COLORS, CHARACTER_LIMIT } from '../constants';

/**
 * Get character counter color based on length
 * - Default (stone-400): under warning threshold
 * - Warning (amber-500): 35+ characters
 * - Error (red-500): 45+ characters
 */
export function getCharacterCounterColor(length: number): string {
  if (length >= CHARACTER_LIMIT.errorThreshold) {
    return COLORS.red500;
  }
  if (length >= CHARACTER_LIMIT.warningThreshold) {
    return COLORS.amber500;
  }
  return COLORS.stone400;
}
