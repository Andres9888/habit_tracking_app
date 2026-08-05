/**
 * Icon accent tokens — the curated hue set every template accent snaps onto.
 *
 * Replaces the 47 free-form `iconColor` hexes that accumulated in the template
 * seed. Those hexes clustered tightly by hue (see `snapToIconToken`), so the
 * ten tokens below cover all 317 seeded templates without a visible change in
 * light mode — while finally giving each accent a dark-mode counterpart.
 *
 * `light` sits at roughly Tailwind 500/600 (saturated, reads on the warm cream
 * canvas). `dark` sits at roughly Tailwind 400 — lifted, so the accent still
 * separates from the #111827 dark canvas instead of sinking into it.
 */

import type { IconToken, IconTokenKey } from './types';

export const ICON_TOKENS: Record<IconTokenKey, IconToken> = {
  ember: { light: '#DC2626', dark: '#F87171', hue: 0 },
  sunrise: { light: '#F97316', dark: '#FB923C', hue: 25 },
  amber: { light: '#F59E0B', dark: '#FBBF24', hue: 40 },
  forest: { light: '#10B981', dark: '#34D399', hue: 155 },
  teal: { light: '#14B8A6', dark: '#2DD4BF', hue: 182 },
  sky: { light: '#0EA5E9', dark: '#38BDF8', hue: 205 },
  indigo: { light: '#6366F1', dark: '#818CF8', hue: 240 },
  violet: { light: '#8B5CF6', dark: '#A78BFA', hue: 263 },
  magenta: { light: '#EC4899', dark: '#F472B6', hue: 320 },
  // Reached by desaturated input rather than by hue — see `snapToIconToken`.
  slate: { light: '#64748B', dark: '#94A3B8', hue: -1 },
};

export const DEFAULT_ICON_TOKEN: IconTokenKey = 'slate';

/** Tokens ordered by hue, excluding the achromatic `slate` escape hatch. */
export const CHROMATIC_TOKENS = (
  Object.entries(ICON_TOKENS) as [IconTokenKey, IconToken][]
).filter(([, token]) => token.hue >= 0);
