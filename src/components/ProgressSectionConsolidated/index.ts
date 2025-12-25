/**
 * ProgressSectionConsolidated Component Exports
 *
 * Consolidated progress view that merges 3 separate cards
 * (YourProgressCard, PersonalBestsCard, ThisMonthCard) into
 * a single unified component with improved visual hierarchy.
 *
 * Key improvements:
 * - Single neutral gradient theme (vs 3 different gradients)
 * - Hero section with clear primary metric
 * - Horizontal scroll insight chips (reduces vertical space)
 * - Compact weekly pattern chart
 * - Collapsible streak records
 * - ~35% reduction in vertical space
 */

// Main container component
export { ProgressSectionConsolidated } from './ProgressSectionConsolidated';

// Sub-components
export { HeroStrengthSection } from './HeroStrengthSection';
export { InsightChips } from './InsightChips';
export { WeeklyPatternChart } from './WeeklyPatternChart';
export { ActionableTipCard } from './ActionableTipCard';
export { StreakRecordsAccordion } from './StreakRecordsAccordion';
export { TodaysFocusCard } from './TodaysFocusCard';

// Helper components (used internally)
export { TrendIndicator } from './TrendIndicator';
export { AnimatedPercentageText } from './AnimatedPercentageText';
export { DayBar } from './DayBar';

// Types
export * from './types';
export * from './TodaysFocusCardTypes';

// Re-export utility functions from existing ProgressSection
// These are reused for data calculations
export {
  calculateDayOfWeekStats,
  calculateCurrentStreak,
  calculateStreakRecords,
  calculateTrendComparison,
  generateActionableTip,
  getBestAndWorstDays,
} from '../ProgressSection/utils';
