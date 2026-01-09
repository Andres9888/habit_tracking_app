/**
 * Time of Day Selector Utilities
 * Helper functions for phase-based reminder times
 */

import type { HubermanPhase } from '../../../../constants/hubermanPhases';

/**
 * Maps each Huberman phase to a default reminder time
 * - Phase 1 (Push/Morning): 7:00 AM
 * - Phase 2 (Pivot/Afternoon): 12:00 PM
 * - Phase 3 (Pull/Evening): 8:00 PM
 */
export const PHASE_REMINDER_TIMES: Record<
  HubermanPhase,
  { hour: number; minute: number }
> = {
  phase1_push: { hour: 7, minute: 0 },
  phase2_pivot: { hour: 12, minute: 0 },
  phase3_pull: { hour: 20, minute: 0 },
};

/**
 * Creates a Date object for the reminder time based on the selected phase
 */
export const getReminderTimeForPhase = (phase: HubermanPhase): Date => {
  const time = PHASE_REMINDER_TIMES[phase];
  const date = new Date();
  date.setHours(time.hour, time.minute, 0, 0);
  return date;
};
