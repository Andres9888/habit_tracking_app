/**
 * Hero gradient derivation from template iconColor
 * Produces a richer 3-stop diagonal gradient for hero surfaces.
 */

import { colors } from '@/theme';
import { withAlpha } from '@/theme/colors';

/**
 * Build a 3-stop gradient from the template's icon color, matching the
 * mockup's `linear-gradient(160deg, iconColor 25% -> iconColor 15% 45% -> bg)`.
 * Stop 1: iconColor at 25% alpha (strong top-left)
 * Stop 2: iconColor at 15% alpha (mid transition)
 * Stop 3: page background (seamless blend)
 */
export function buildHeroGradient(
  iconColor: string
): readonly [string, string, string] {
  return [
    withAlpha(iconColor, 0.25),
    withAlpha(iconColor, 0.15),
    colors.background,
  ] as const;
}
