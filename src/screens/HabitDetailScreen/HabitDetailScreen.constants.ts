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
  }
) {
  return {
    handleConfirmArchive: calendarHandlers.handleConfirmArchive,
    handleConfirmDelete: calendarHandlers.handleConfirmDelete,
    handleUndoArchive: calendarHandlers.handleUndoArchive,
    handleUndoDelete: calendarHandlers.handleUndoDelete,
    pendingArchive: screenState.pendingArchive,
    pendingDelete: screenState.pendingDelete,
    setPendingDelete: screenState.setPendingDelete,
  };
}
