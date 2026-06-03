/** Base percentage size inside the hero ring (two-digit values). */
export const PERCENTAGE_FONT_SIZE = 28;

/** Smaller size when the label needs three digits (e.g. 100%). */
export const PERCENTAGE_FONT_SIZE_COMPACT = 24;

/**
 * Pick a font size that keeps the percentage label inside the ring.
 * Three-digit values get a tighter size so "100%" does not clip the stroke.
 */
export function getPercentageFontSize(value: number): number {
  return value >= 100 ? PERCENTAGE_FONT_SIZE_COMPACT : PERCENTAGE_FONT_SIZE;
}
