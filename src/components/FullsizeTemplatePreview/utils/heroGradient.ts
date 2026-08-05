/**
 * Hero gradient derivation from template iconColor
 * Produces a richer 3-stop diagonal gradient for hero surfaces.
 */

import { darkenColor } from '../../CreateHabitModal/components/StickyCreateBar/colorUtils';

/**
 * Build a 3-stop gradient from the template's icon color.
 * Stop 1: darkened iconColor at 40% alpha (strong top-left)
 * Stop 2: iconColor at 25% alpha (mid transition)
 * Stop 3: page background (seamless blend)
 */
export function buildHeroGradient(
  iconColor: string,
): readonly [string, string, string] {
  const darkened = darkenColor(iconColor, 15);
  return [`${darkened}40`, `${iconColor}25`, '#FAFAF9'] as const;
}
