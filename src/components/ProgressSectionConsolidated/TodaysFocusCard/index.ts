/**
 * TodaysFocusCard
 *
 * Barrel export for the TodaysFocusCard component.
 */

export { TodaysFocusCard, default } from './TodaysFocusCard';

// Re-export types from the shared types file
export {
  type TodaysFocusCardProps,
  type FocusState,
  type FocusStateConfig,
  type MilestoneCelebrationConfig,
  CELEBRATION_MILESTONES,
  getCelebrationMilestone,
  getNextCelebrationMilestone,
} from '../TodaysFocusCardTypes';
