/**
 * Analytics Helper Functions
 * Utility functions for time window and chip data
 */

import type { SuggestionChip } from '../types';
import type { TimeWindow } from './types';

/**
 * Get time window category from hour
 */
export function getTimeWindowFromHour(hour: number): TimeWindow {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

/**
 * Get chip labels array from chips
 */
export function getChipLabels(chips: SuggestionChip[]): string[] {
  return chips.map((chip) => chip.label);
}
