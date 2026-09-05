/**
 * Contrast guard for arbitrary template `iconColor` values used as text on
 * light surfaces (category pill, hero accents). Templates carry hand-picked
 * hexes with no guaranteed contrast, unlike our curated design tokens.
 */

import { darkenColor } from './darkenColor';

const MAX_LUMINANCE = 0.28;
const MAX_ITERATIONS = 4;
const DARKEN_STEP_PERCENT = 12;

function relativeLuminance(hex: string): number {
  const color = hex.replace('#', '');
  const r = Number.parseInt(color.slice(0, 2), 16) / 255;
  const g = Number.parseInt(color.slice(2, 4), 16) / 255;
  const b = Number.parseInt(color.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Darkens `hex` until its relative luminance drops under the readability
 * threshold, capped at a handful of iterations so pale colors still land on
 * something legible rather than looping toward black.
 */
export function readableAccent(hex: string): string {
  let color = hex;
  let iterations = 0;
  while (
    relativeLuminance(color) > MAX_LUMINANCE &&
    iterations < MAX_ITERATIONS
  ) {
    color = darkenColor(color, DARKEN_STEP_PERCENT);
    iterations += 1;
  }
  return color;
}
