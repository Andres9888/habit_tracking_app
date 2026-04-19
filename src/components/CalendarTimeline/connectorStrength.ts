/**
 * Strength-based connector evolution for the CalendarTimeline.
 *
 * Connectors grow thicker, brighter, and gain shimmer/glow
 * as the user's streak lengthens.
 */

export interface TimelineConnectorStrength {
  height: number;
  /** Max opacity applied to the connector color */
  opacity: number;
  /** Shimmer cycle duration in ms (0 = no shimmer) */
  shimmerSpeed: number;
  /** Whether to apply a shadow glow */
  glow: boolean;
}

export function getTimelineConnectorStrength(
  streak: number
): TimelineConnectorStrength {
  if (streak >= 30) {
    return { height: 5, opacity: 0.85, shimmerSpeed: 1000, glow: true };
  }
  if (streak >= 14) {
    return { height: 4.5, opacity: 0.8, shimmerSpeed: 1200, glow: false };
  }
  if (streak >= 7) {
    return { height: 4, opacity: 0.7, shimmerSpeed: 1500, glow: false };
  }
  if (streak >= 5) {
    return { height: 4, opacity: 0.6, shimmerSpeed: 2000, glow: false };
  }
  if (streak >= 3) {
    return { height: 3.5, opacity: 0.5, shimmerSpeed: 0, glow: false };
  }
  return { height: 3, opacity: 0.35, shimmerSpeed: 0, glow: false };
}
