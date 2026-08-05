/**
 * Science drill-down accent + gradient wash.
 *
 * Collapsed to a single trust-green token set (mockup shows one consistent
 * green regardless of template category) instead of per-category buckets —
 * keeps the science card visually distinct from the hero's per-template
 * iconColor accent.
 */

import { colors } from '@/theme';
import { withAlpha } from '@/theme/colors';
import type { Template } from '../../../../types/template';

export interface ScienceTheme {
  accent: string;
  gradientStart: string;
  gradientEnd: string;
}

const GREEN: ScienceTheme = {
  accent: colors.primary[600],
  gradientStart: withAlpha(colors.primary[600], 0.16),
  gradientEnd: withAlpha(colors.primary[600], 0.06),
};

export function scienceTheme(_template?: Template): ScienceTheme {
  return GREEN;
}
