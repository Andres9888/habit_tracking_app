/**
 * @module strengthUtils
 *
 * Pure functions for the 5-tier habit strength system.
 *
 * Default tiers mirror the chain material tiers:
 *   🪙 Copper (0–19%)  →  🔗 Chain (20–39%)  →  ⚙️ Iron (40–59%)
 *   →  🥇 Gold (60–79%)  →  💎 Legendary (80–100%)
 *
 * Tier emojis are user-customizable per habit via `emojis` parameter.
 */
import {
  DEFAULT_PROGRESS_EMOJIS,
  type ProgressEmojiSet,
} from '../../utils/progressEmojis';

/** Convert server-side 0–1 decimal to a 0–100 display percentage. */
export function getStrengthPercent(strength: number | undefined): number {
  return (strength ?? 0) * 100;
}

/** Map a strength percentage to its tier emoji (matches progress bar dividers at 20/40/60/80). */
export function getStrengthEmoji(
  strengthPercent: number,
  emojis: ProgressEmojiSet = DEFAULT_PROGRESS_EMOJIS
): string {
  if (strengthPercent >= 80) return emojis.automatic;
  if (strengthPercent >= 60) return emojis.strong;
  if (strengthPercent >= 40) return emojis.developing;
  if (strengthPercent >= 20) return emojis.building;
  return emojis.starting;
}

/** Human-readable tier label for a strength percentage. Used to detect level-up transitions. */
export function getStrengthLabel(strengthPercent: number): string {
  if (strengthPercent >= 80) return 'Automatic';
  if (strengthPercent >= 60) return 'Strong';
  if (strengthPercent >= 40) return 'Developing';
  if (strengthPercent >= 20) return 'Building';
  return 'Starting';
}
