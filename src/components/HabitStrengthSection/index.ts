/**
 * Habit Strength Section
 *
 * Chart-led habit strength card: kicker + stage badge, timeline chart with
 * bezier curve, and the 5-stop milestone track.
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
export { StrengthChart } from './StrengthChart';

// Types
export type {
  HabitStrengthSectionProps,
  StrengthChartProps,
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
