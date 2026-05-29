/**
 * Habit Strength Section
 *
 * A redesigned habit strength visualization with:
 * - Time range switcher (1M/1Y/All)
 * - Circular progress ring with animated fill
 * - Full-width timeline chart with bezier curves
 * - Comparison stats row
 *
 * @example
 * ```tsx
 * <HabitStrengthSection
 *   habitId={habit._id}
 *   completedDates={completedDates}
 *   habitCreatedAt={habit.createdAt}
 *   habitColor={habit.iconColor}
 * />
 * ```
 */

export { HabitStrengthSection, default } from './HabitStrengthSection';
export { TimeRangeToggle } from './TimeRangeToggle';
export { StrengthHero } from './StrengthHero';
export { StrengthChart } from './StrengthChart';
export { StrengthStatsRow } from './StrengthStatsRow';
export { TierJourneyStrip } from './TierJourneyStrip';
export { StrengthActionTip } from './StrengthActionTip';

// Types
export type {
  HabitStrengthSectionProps,
  TimeRangeToggleProps,
  StrengthHeroProps,
  StrengthChartProps,
  StrengthStatsRowProps,
  TimeRange,
  ExtendedStrengthMetrics,
} from './types';

// Constants
export {
  RING_SIZE,
  RING_STROKE_WIDTH,
  CHART_HEIGHT,
  STRENGTH_COLORS,
  COLORS,
  getStrengthColors,
  getThemeColors,
  ANIMATION,
  TIME_RANGE_OPTIONS,
  STRENGTH_LABELS,
} from './constants';
export type { StrengthColorSet } from './constants';
