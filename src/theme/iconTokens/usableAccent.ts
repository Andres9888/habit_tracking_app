/**
 * Guards habit accent colours before they hit the UI.
 *
 * `habit.color` / `habit.iconColor` are free-form hex (template seed rows,
 * legacy imports). A near-white value such as `#FFFFFF` renders an invisible
 * accent bar and blank check-in cells on the cream card, so anything lighter
 * than `MAX_ACCENT_LIGHTNESS` is treated as "no colour" and callers fall back
 * to their deterministic default. Named colours and garbage are rejected too.
 */

import { hexToHsl } from './snap';

/** HSL lightness (0-100) above which an accent no longer reads on a card. */
export const MAX_ACCENT_LIGHTNESS = 85;

export function isUsableAccentHex(
  hex: string | null | undefined
): hex is string {
  if (!hex) return false;
  const hsl = hexToHsl(hex);
  if (!hsl) return false;
  return hsl.lightness <= MAX_ACCENT_LIGHTNESS;
}

/** First candidate that is a readable accent hex, else `undefined`. */
export function pickUsableAccent(
  ...candidates: Array<string | null | undefined>
): string | undefined {
  for (const candidate of candidates) {
    if (isUsableAccentHex(candidate)) return candidate;
  }
  return undefined;
}
