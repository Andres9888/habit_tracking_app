/**
 * MilestoneProgress Types - Barrel Re-export
 *
 * Re-exports from decomposed modules for backwards compatibility.
 * @see milestones.types.ts - Type definitions
 * @see milestones.data.ts - Milestone constants
 * @see milestoneCalculations.ts - Business logic
 */

export type {
  Milestone,
  MilestoneDisplayState,
  MilestoneProgressProps,
  MilestoneCalculation,
} from './milestones.types';

export { MILESTONES } from './milestones.data';

export {
  getNextMilestone,
  getCurrentMilestone,
  getPreviousMilestone,
  isOnMilestone,
  calculateMilestoneProgress,
} from './milestoneCalculations';
