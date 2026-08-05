/**
 * Snaps an arbitrary `iconColor` hex onto the curated icon token set.
 *
 * Template rows store free-form hex, so this runs at render time rather than
 * requiring a data migration — legacy seed values and any future user-picked
 * colour both resolve to a token that has a dark-mode counterpart.
 */

import { CHROMATIC_TOKENS, DEFAULT_ICON_TOKEN } from './tokens';
import type { IconTokenKey } from './types';

/** Below this saturation a colour reads as grey, so hue matching is noise. */
const ACHROMATIC_SATURATION = 25;
/** Near-white / near-black inputs carry no usable accent hue either. */
const MIN_LIGHTNESS = 15;
const MAX_LIGHTNESS = 90;

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

function expand(hex: string): string | null {
  const match = HEX_PATTERN.exec(hex.trim());
  if (!match) return null;
  const body = match[1];
  return body.length === 3 ? [...body].map((c) => c + c).join('') : body;
}

interface Hsl {
  hue: number;
  saturation: number;
  lightness: number;
}

export function hexToHsl(hex: string): Hsl | null {
  const body = expand(hex);
  if (!body) return null;

  const r = Number.parseInt(body.slice(0, 2), 16) / 255;
  const g = Number.parseInt(body.slice(2, 4), 16) / 255;
  const b = Number.parseInt(body.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) return { hue: 0, lightness: lightness * 100, saturation: 0 };

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue: number;
  if (max === r) hue = 60 * (((g - b) / delta) % 6);
  else if (max === g) hue = 60 * ((b - r) / delta + 2);
  else hue = 60 * ((r - g) / delta + 4);

  return {
    hue: (hue + 360) % 360,
    lightness: lightness * 100,
    saturation: saturation * 100,
  };
}

/** Shortest distance between two hues on the 360° colour wheel. */
function hueDistance(a: number, b: number): number {
  const raw = Math.abs(a - b) % 360;
  return raw > 180 ? 360 - raw : raw;
}

export function snapToIconToken(hex: string): IconTokenKey {
  const hsl = hexToHsl(hex);
  if (!hsl) return DEFAULT_ICON_TOKEN;

  const isAchromatic =
    hsl.saturation < ACHROMATIC_SATURATION ||
    hsl.lightness < MIN_LIGHTNESS ||
    hsl.lightness > MAX_LIGHTNESS;
  if (isAchromatic) return DEFAULT_ICON_TOKEN;

  let best = DEFAULT_ICON_TOKEN;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const [key, token] of CHROMATIC_TOKENS) {
    const distance = hueDistance(hsl.hue, token.hue);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = key;
    }
  }
  return best;
}
