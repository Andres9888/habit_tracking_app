/**
 * SkeletonLoader Components
 *
 * Loading hints for various UI elements.
 * Provides shimmer animation while content loads.
 * Includes specialized skeletons for habits, calendar, momentum meter.
 */

export { SkeletonLoader } from './SkeletonLoader';
export { HabitCardSkeleton } from './HabitCardSkeleton';
export { CalendarTimelineSkeleton } from './CalendarTimelineSkeleton';
export { MomentumMeterSkeleton } from './MomentumMeterSkeleton';
export { HabitsPageSkeleton } from './HabitsPageSkeleton';
export { AnalyticsScreenSkeleton } from './AnalyticsScreenSkeleton';
export { HabitDetailSkeleton } from './HabitDetailSkeleton';
export { SettingsModalSkeleton } from './SettingsModalSkeleton';
export { CharacterScreenSkeleton } from './CharacterScreenSkeleton';
export { TemplateListSkeleton } from './TemplateListSkeleton';
export { BrandedLoadingSkeleton } from './BrandedLoadingSkeleton';
export { InitializeHabitStrengthSkeleton } from './InitializeHabitStrengthSkeleton';
export type {
  SkeletonLoaderProps,
  ReduceMotionProps,
  SkeletonWidth,
} from './types';
export { useSkeletonTheme } from './useSkeletonTheme';
export {
  SKELETON_COLORS_LIGHT,
  SKELETON_COLORS_DARK,
  SHIMMER_DURATION,
} from './SkeletonLoader';
export { default } from './SkeletonLoader';
