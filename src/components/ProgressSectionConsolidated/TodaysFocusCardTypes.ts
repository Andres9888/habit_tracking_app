/**
 * TodaysFocusCard Types - Barrel Export
 *
 * Re-exports all types, constants, and utilities for backward compatibility.
 */

export type {
  FocusState,
  FocusStateConfig,
  TodaysFocusCardProps,
  MilestoneValue,
  MilestoneCelebrationConfig,
} from './TodaysFocusCard.types';

export {
  MILESTONE_THRESHOLDS,
  CELEBRATION_MILESTONES,
  getCelebrationMilestone,
  getNextCelebrationMilestone,
} from './TodaysFocusCard.milestones';
