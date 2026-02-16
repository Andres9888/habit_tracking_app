/**
 * @module strengthUtils
 *
 * Pure functions for the 5-tier habit strength system.
 *
 * Tiers:  🌱 Starting (0–19%)  →  🌿 Building (20–39%)  →  🌳 Developing (40–59%)
 *         →  💪 Strong (60–79%)  →  ⚡ Automatic (80–100%)
 */

/** Convert server-side 0–1 decimal to a 0–100 display percentage. */
export function getStrengthPercent(strength: number | undefined): number {
  return (strength ?? 0) * 100;
}

/** Map a strength percentage to its tier emoji (matches progress bar dividers at 20/40/60/80). */
export function getStrengthEmoji(strengthPercent: number): string {
  if (strengthPercent >= 80) return '⚡'; // Automatic
  if (strengthPercent >= 60) return '💪'; // Strong
  if (strengthPercent >= 40) return '🌳'; // Developing
  if (strengthPercent >= 20) return '🌿'; // Building
  return '🌱'; // Starting
}

/** Human-readable tier label for a strength percentage. Used to detect level-up transitions. */
export function getStrengthLabel(strengthPercent: number): string {
  if (strengthPercent >= 80) return 'Automatic';
  if (strengthPercent >= 60) return 'Strong';
  if (strengthPercent >= 40) return 'Developing';
  if (strengthPercent >= 20) return 'Building';
  return 'Starting';
}
