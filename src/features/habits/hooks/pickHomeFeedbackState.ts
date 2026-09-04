/**
 * The Home-side post-create feedback slice of ModalVisibilityState: the toast
 * for the regular add-habit form. Kept as one pick so
 * buildModalsStateReturnValue stays a flat map.
 */

import type { ModalVisibilityState } from './useModalVisibilityState';

export function pickHomeFeedbackState(v: ModalVisibilityState) {
  return {
    createdHabitCount: v.createdHabitCount,
    createdHabitFeedback: v.createdHabitFeedback,
    dismissCreatedHabitFeedback: v.dismissCreatedHabitFeedback,
    rekeyCreatedHabitFeedback: v.rekeyCreatedHabitFeedback,
    showCreatedHabitFeedback: v.showCreatedHabitFeedback,
  };
}
