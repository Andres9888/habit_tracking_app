/** Constants and helpers for HabitDetailScreen */

/** Assemble props for HabitDetailModals from hook return values */
export function buildModalsProps(
  screenState: {
    pendingArchive: boolean;
    pendingDelete: boolean;
    setPendingDelete: (v: boolean) => void;
  },
  calendarHandlers: {
    handleConfirmArchive: () => void;
    handleConfirmDelete: () => void;
    handleUndoArchive: () => void;
    handleUndoDelete: () => void;
  },
  completeHandlers: {
    toastMessage: string | null;
    dismissToast: () => void;
    handleUndo: () => void;
  }
) {
  return {
    completeToastMessage: completeHandlers.toastMessage,
    handleConfirmArchive: calendarHandlers.handleConfirmArchive,
    handleConfirmDelete: calendarHandlers.handleConfirmDelete,
    handleDismissComplete: completeHandlers.dismissToast,
    handleUndoArchive: calendarHandlers.handleUndoArchive,
    handleUndoComplete: completeHandlers.handleUndo,
    handleUndoDelete: calendarHandlers.handleUndoDelete,
    pendingArchive: screenState.pendingArchive,
    pendingDelete: screenState.pendingDelete,
    setPendingDelete: screenState.setPendingDelete,
  };
}
