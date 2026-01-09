/**
 * Constants for LoadingSkeleton component
 */

/**
 * Skeleton colors per spec
 */
export const SKELETON_COLORS = {
  base: '#E7E5E4',
  highlight: '#F5F5F4',
} as const;

/**
 * Shimmer animation duration per spec
 */
export const SHIMMER_DURATION = 1500;

/**
 * Skeleton element dimensions matching the empty state layout
 */
export const SKELETON_DIMENSIONS = {
  chip: { height: 44, width: 80 },
  cta: { height: 56 },
  headline: { height: 32, width: 260 },
  hero: { height: 80, width: 80 },
  input: { height: 56 },
} as const;
