/**
 * ProgressSection Component Exports
 *
 * @deprecated This module is deprecated. Use `../ProgressSectionConsolidated` instead.
 *
 * The ProgressSection and its child components (YourProgressCard, PersonalBestsCard,
 * ThisMonthCard) have been replaced by `ProgressSectionConsolidated` which provides:
 * - Single unified card with improved visual hierarchy
 * - ~35% reduction in vertical space
 * - Horizontal scroll insight chips
 * - Collapsible streak records accordion
 * - Better accessibility support
 *
 * These components are kept for backward compatibility but will be removed
 * in the next major version.
 *
 * Migration:
 *   // Old
 *   import { ProgressSection } from '../ProgressSection';
 *   <ProgressSection tracking={...} strength={75} ... />
 *
 *   // New
 *   import { ProgressSectionConsolidated } from '../ProgressSectionConsolidated';
 *   <ProgressSectionConsolidated tracking={...} strength={75} ... />
 */

/** @deprecated Use ProgressSectionConsolidated instead */
export { ProgressSection } from './ProgressSection';
/** @deprecated Use ProgressSectionConsolidated instead - functionality moved to HeroStrengthSection + ActionableTipCard */
export { YourProgressCard } from './YourProgressCard';
/** @deprecated Use ProgressSectionConsolidated instead - functionality moved to InsightChips + StreakRecordsAccordion */
export { PersonalBestsCard } from './PersonalBestsCard';
/** @deprecated Use ProgressSectionConsolidated instead - functionality moved to WeeklyPatternChart + InsightChips */
export { ThisMonthCard } from './ThisMonthCard';

// Types and utils are still actively used by ProgressSectionConsolidated
export * from './types';
export * from './utils';
