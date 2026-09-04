/**
 * The Home-side post-create feedback slice of ModalVisibilityState: the toast
 * for the regular add-habit form and the reveal request its "Go to" raises.
 * Kept as one pick so buildModalsStateReturnValue stays a flat map.
 */

import type { ModalVisibilityState } from './useModalVisibilityState';

export function pickHomeFeedbackState(v: ModalVisibilityState) {
  return {
    clearRevealHabit: v.clearRevealHabit,
    createdHabitCount: v.createdHabitCount,
    createdHabitFeedback: v.createdHabitFeedback,
    dismissCreatedHabitFeedback: v.dismissCreatedHabitFeedback,
    rekeyCreatedHabitFeedback: v.rekeyCreatedHabitFeedback,
    revealHabitId: v.revealHabitId,
    revealHabitOnHome: v.revealHabitOnHome,
    showCreatedHabitFeedback: v.showCreatedHabitFeedback,
  };
}
