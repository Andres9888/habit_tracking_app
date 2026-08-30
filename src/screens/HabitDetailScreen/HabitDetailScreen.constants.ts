/** Constants and helpers for HabitDetailScreen */

/** Assemble props for HabitDetailModals from hook return values */
export function buildModalsProps(
  screenState: {
    isCompletedToday: boolean;
    loggedStreak: number;
    pendingArchive: boolean;
    pendingDelete: boolean;
    setPendingDelete: (v: boolean) => void;
  },
  calendarHandlers: {
    handleCalendarDayPress: (date: string, wasCompleted: boolean) => void;
    handleConfirmArchive: () => void;
    handleConfirmDelete: () => void;
    handleUndoArchive: () => void;
    handleUndoDelete: () => void;
  }
) {
  return {
    // The log-derived streak, never `habit.currentStreak`: the stored field is
    // not recomputed on a miss, so it would announce a run that already ended.
    currentStreak: screenState.loggedStreak,
    handleConfirmArchive: calendarHandlers.handleConfirmArchive,
    handleConfirmDelete: calendarHandlers.handleConfirmDelete,
    // The toast hands back the date it fired for; undoing "today" at press time
    // unlogs the wrong day once the toast has outlived local midnight.
    handleUndoCompletionToast: (date: string) =>
      calendarHandlers.handleCalendarDayPress(date, true),
    handleUndoArchive: calendarHandlers.handleUndoArchive,
    handleUndoDelete: calendarHandlers.handleUndoDelete,
    isCompletedToday: screenState.isCompletedToday,
    pendingArchive: screenState.pendingArchive,
    pendingDelete: screenState.pendingDelete,
    setPendingDelete: screenState.setPendingDelete,
  };
}
