import type { StrengthConfig } from './types';

/**
 * Get strength configuration based on streak count
 *
 * Features strength-based evolution:
 * - Day 1-2: Subtle connection (1.5px, 35% opacity)
 * - Day 3-4: Growing strength (1.8px, 45% opacity)
 * - Day 5-6: Stronger chain (2.1px, 55% opacity, accent glow begins)
 * - Day 7-13: Strong chain (2.4px, 65% opacity, accent glow)
 * - Day 14-20: Very strong (2.7px, 75% opacity, accent glow)
 * - Day 21+: Legendary status (3px, 85% opacity, accent glow)
 */
export const getStrengthConfig = (streak: number): StrengthConfig => {
  if (streak >= 21) {
    return { height: 3, maxOpacity: 0.85, shimmerSpeed: 1000, useAccent: true };
  }
  if (streak >= 14) {
    return {
      height: 2.7,
      maxOpacity: 0.75,
      shimmerSpeed: 1200,
      useAccent: true,
    };
  }
  if (streak >= 7) {
    return {
      height: 2.4,
      maxOpacity: 0.65,
      shimmerSpeed: 1500,
      useAccent: true,
    };
  }
  if (streak >= 5) {
    return {
      height: 2.1,
      maxOpacity: 0.55,
      shimmerSpeed: 2000,
      useAccent: true,
    };
  }
  if (streak >= 3) {
    return { height: 1.8, maxOpacity: 0.45, shimmerSpeed: 0, useAccent: false };
  }
  return { height: 1.5, maxOpacity: 0.35, shimmerSpeed: 0, useAccent: false };
};
