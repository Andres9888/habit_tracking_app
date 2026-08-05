/**
 * Single source of truth for the five strength-tier boundaries.
 * Both the StrengthProgressBar level list and the HabitCard rank tile
 * read from here so the small emoji on the bar and the big metallic
 * tile cross levels on the same percentages.
 */

export const STRENGTH_LEVEL_THRESHOLDS = [0, 20, 40, 60, 80] as const;

export type StrengthLevelThreshold =
  (typeof STRENGTH_LEVEL_THRESHOLDS)[number];

export const STRENGTH_TIER_INDEX = {
  starting: 0,
  building: 1,
  developing: 2,
  strong: 3,
  automatic: 4,
} as const;
