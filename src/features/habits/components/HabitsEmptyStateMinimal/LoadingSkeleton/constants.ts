/**
 * Constants for LoadingSkeleton component
 * Re-exports core skeleton colors for consistency.
 */

export {
  SKELETON_COLORS_LIGHT as SKELETON_COLORS,
  SHIMMER_DURATION,
} from '../../../../../components/SkeletonLoader/SkeletonLoader';

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
