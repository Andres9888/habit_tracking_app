import type { HabitsModalsState } from './hooks/types';

interface OverlayVisibilityInput {
  batchArchiveUndoVisible: boolean;
  confirmDeleteVisible: boolean;
  paywallVisible: boolean;
}

export function hasRequestedOverlay(
  modals: HabitsModalsState,
  input: OverlayVisibilityInput
): boolean {
  return [
    input.paywallVisible,
    input.batchArchiveUndoVisible,
    input.confirmDeleteVisible,
    modals.showSettings,
    modals.showCreateHabit,
    modals.showEditScreen,
    modals.showHabitCalendar,
    modals.showHabitDetail,
    modals.showHapticTest,
    modals.showShareCard,
    modals.showPauseModal,
    modals.showTemplatesScreen,
    modals.showQuickActions,
    modals.showVisualizationExercise,
  ].some(Boolean);
}
