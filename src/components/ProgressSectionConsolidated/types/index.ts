/**
 * ProgressSectionConsolidated Types
 *
 * Type definitions for the consolidated progress section components.
 */

// Re-export shared types from existing ProgressSection
export type {
  DayStats,
  StreakRecord,
  LevelConfig,
  TrendComparison,
} from '../../ProgressSection/types';

// Re-export container/hero props
export type {
  ProgressSectionConsolidatedProps,
  HeroStrengthSectionProps,
} from './container.props';

// Re-export component props
export type {
  InsightChipsProps,
  WeeklyPatternChartProps,
  ActionableTipCardProps,
  StreakRecordsAccordionProps,
} from './component.props';

// Re-export data types
export type { InsightChipData, LevelThreshold } from './data.types';

// Re-export level constants and helpers
export { STRENGTH_LEVELS } from './strengthLevels';
export { getLevelFromStrength, getProgressToNextLevel } from './levelHelpers';
