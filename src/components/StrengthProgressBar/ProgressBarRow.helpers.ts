/**
 * ProgressBarRow Helpers
 * Gradient color mapping for strength levels
 */

import { colors } from '@/theme/colors';

/**
 * Get gradient colors for strength level
 * Creates a richer visual with gradient instead of solid fill
 */
export function getGradientColors(baseColor: string): [string, string, string] {
  const gradientMap: Record<string, [string, string, string]> = {
    [colors.strength.starting]: ['#bef264', '#65a30d', '#4d7c0f'],
    [colors.strength.building]: ['#86efac', '#16a34a', '#15803d'],
    [colors.strength.developing]: ['#5eead4', '#0d9488', '#0f766e'],
    [colors.strength.strong]: ['#67e8f9', '#0891b2', '#0e7490'],
    [colors.strength.automatic]: ['#6ee7b7', '#059669', '#047857'],
  };
  return gradientMap[baseColor] || [baseColor, baseColor, baseColor];
}
