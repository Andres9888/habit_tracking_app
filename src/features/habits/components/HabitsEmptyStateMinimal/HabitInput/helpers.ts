/**
 * Helper functions for HabitInput
 */

import { CHARACTER_LIMIT } from '../constants';

/**
 * Get character counter color based on length
 * - Default (gray): under warning threshold
 * - Warning (amber-500): 35+ characters
 * - Error (red-500): 45+ characters
 */
export function getCharacterCounterColor(length: number): string {
  if (length >= CHARACTER_LIMIT.errorThreshold) {
    return '#EF4444'; // red-500
  }
  if (length >= CHARACTER_LIMIT.warningThreshold) {
    return '#F59E0B'; // amber-500
  }
  return '#A8A29E'; // stone-400 — functional color, visible in both modes
}
