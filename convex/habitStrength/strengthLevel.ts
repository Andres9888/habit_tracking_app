/**
 * Strength Level Calculation
 * Determine strength level from numerical value
 */
import type { StrengthLevel } from './types';

/**
 * Determine strength level from numerical strength value
 * Updated thresholds for v2.0 momentum-based formula:
 * - 0-29%: Starting (just beginning)
 * - 30-59%: Building (making progress)
 * - 60-84%: Strong (well-established)
 * - 85-100%: Automatic (fully habitual)
 */
export function getStrengthLevel(strength: number): StrengthLevel {
  // Convert 0-100 scale to 0-1 if needed (backwards compatible)
  const normalizedStrength = strength > 1 ? strength / 100 : strength;

  if (normalizedStrength < 0.3) return 'starting';
  if (normalizedStrength < 0.6) return 'building';
  if (normalizedStrength < 0.85) return 'strong';
  return 'automatic';
}
