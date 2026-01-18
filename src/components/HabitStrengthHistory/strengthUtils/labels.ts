import type { StrengthColors, StrengthLabel } from '../types';
import {
  STRENGTH_COLOR_MAP,
  STRONG_THRESHOLD,
  WEAK_THRESHOLD,
} from './constants';

/**
 * Get the human-readable strength label based on percentage.
 *
 * Thresholds:
 * - 0-29%: "weak" (habit not established)
 * - 30-69%: "developing" (building consistency)
 * - 70-100%: "strong" (habit is automatic)
 *
 * @param strength - Strength percentage (0-100)
 * @returns Strength label
 */
export function getStrengthLabel(strength: number): StrengthLabel {
  if (strength < WEAK_THRESHOLD) {
    return 'weak';
  }
  if (strength < STRONG_THRESHOLD) {
    return 'developing';
  }
  return 'strong';
}

/**
 * Get the primary color for a strength value.
 *
 * @param strength - Strength percentage (0-100)
 * @returns Color hex string
 */
export function getStrengthColor(strength: number): string {
  const label = getStrengthLabel(strength);
  return STRENGTH_COLOR_MAP[label].primary;
}

/**
 * Get the full color palette for a strength value.
 *
 * @param strength - Strength percentage (0-100)
 * @returns StrengthColors object with primary, background, and ring colors
 */
export function getStrengthColors(strength: number): StrengthColors {
  const label = getStrengthLabel(strength);
  return STRENGTH_COLOR_MAP[label];
}
