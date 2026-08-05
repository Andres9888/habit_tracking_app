/**
 * Timeline connector strength derived from the habit-chain material tier.
 *
 * Before: streak-length thresholds (3/5/7/14/30 days).
 * Now: shares `getMaterialTier` with the HabitChainVisualizer so the
 * calendar timeline and the per-habit chain evolve in lockstep.
 */

import { getMaterialTier } from '../HabitChainVisualizer/materialTier';

export interface TimelineConnectorStrength {
  height: number;
  /** Max opacity applied to the connector color */
  opacity: number;
  /** Shimmer cycle duration in ms (0 = no shimmer) */
  shimmerSpeed: number;
  /** Whether to apply a shadow glow */
  glow: boolean;
}

/**
 * Pick the connector treatment for an overall strength score (0–100).
 * Mirrors `getMaterialTier` thresholds so the calendar timeline upgrades
 * its material in lockstep with the per-habit chain.
 */
export function getTimelineConnectorStrength(
  strengthPercent: number
): TimelineConnectorStrength {
  const tier = getMaterialTier(strengthPercent);
  return {
    height: tier.connectorHeight,
    opacity: tier.connectorOpacity,
    shimmerSpeed: tier.shimmerSpeed,
    glow: tier.glow,
  };
}
