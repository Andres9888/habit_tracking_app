import type { Id } from '../../../../convex/_generated/dataModel';
import type { HabitsModalsState } from './types';
import type { ModalVisibilityState } from './useModalVisibilityState';
import type { HabitSelectionState } from './useHabitSelectionState';
import type {
  HandlersReturn,
  ExtraState,
} from './buildModalsStateReturnValue.types';

/**
 * Builds the complete HabitsModalsState return value by combining visibility state,
 * selection state, handlers, and extra state into a unified interface.
 *
 * @param visibility - Modal visibility state (open/close flags)
 * @param selection - Currently selected habits for various modals
 * @param handlers - Event handlers for modal interactions
 * @param extra - Additional state like settings, habits list, tracking functions
 * @returns Complete HabitsModalsState object with all modal-related state and handlers
 */
export function buildModalsStateReturnValue(
  visibility: ModalVisibilityState,
  selection: HabitSelectionState,
  handlers: HandlersReturn,
  extra: ExtraState
): HabitsModalsState {
  return {
    archivedHabitsCount: extra.archivedHabitsCount,
    // State properties
    celebrationsEnabled: extra.celebrationsEnabled,
    // Handlers from extracted hook
    closeCreateHabit: handlers.closeCreateHabit,

    closeEditScreen: handlers.closeEditScreen,

    closeQuickActions: handlers.closeQuickActions,

    closeShareCard: handlers.closeShareCard,

    habitDetailInitialTab: selection.habitDetailInitialTab,

    closeVisualizationExercise: handlers.closeVisualizationExercise,

    habits: extra.habits,

    confirmPause: handlers.confirmPause,

    habitToEdit: selection.habitToEdit,

    habitToPause: selection.habitToPause,

    milestone: extra.milestone,

    onDeleteHabit: handlers.onDeleteHabit,

    onSettingsChange: handlers.onSettingsChange,

    // Extra handlers
    onChangeCelebrationsEnabled: extra.onChangeCelebrationsEnabled,

    quickActionsHabit: selection.quickActionsHabit,

    handleArchive: extra.handleArchive,

    reduceMotionPreference: extra.reduceMotionPreference,

    clearMilestone: extra.clearMilestone,

    selectedHabit: selection.selectedHabit,

    getStreak: extra.getStreak,

    settings: extra.settings,

    // Inline close handlers
    closeSettings: () => visibility.setIsSettingsOpen(false),

    shareCardData: selection.shareCardData,

    closeHabitCalendar: () => visibility.setIsHabitCalendarOpen(false),

    closeHabitDetail: () => visibility.setIsHabitDetailOpen(false),

    showCreateHabit: visibility.isCreateHabitOpen,

    closeHapticTest: () => visibility.setShowHapticTest(false),

    showEditScreen: visibility.showEditScreen,

    closePauseModal: () => {
      visibility.setShowPauseModal(false);
      selection.setHabitToPause(null);
    },

    showHabitCalendar: visibility.isHabitCalendarOpen,

    closeTemplatesScreen: () => visibility.setShowTemplatesScreen(false),

    // Focus request raised by the Habit Library's post-add primary action.
    // NOTE: this builder ends in `as unknown as HabitsModalsState`, so tsc
    // will NOT flag a field declared in the type but missing here.
    pendingFocusHabitId: visibility.pendingFocusHabitId,
    focusReady: visibility.focusReady,
    focusRequestAutoClose: visibility.focusRequestAutoClose,

    // Prepare remounts and converges Home while the toast still covers it.
    prepareFocusHabitOnHome: (habitId: Id<'habits'>) => {
      visibility.preparePendingFocusHabit(habitId);
    },

    // Commit asks the list to reveal. A ready request skips probe polling;
    // a cold request keeps the baseline converge-then-close behavior.
    commitFocusHabitOnHome: (habitId: Id<'habits'>) => {
      visibility.commitPendingFocusHabit(habitId);
    },

    markFocusHabitReady: (habitId: Id<'habits'>) =>
      visibility.markPendingFocusReady(habitId),

    clearPendingFocusHabit: visibility.clearPendingFocusHabit,

    // Post-create toast for the regular add-habit form.
    createdHabitFeedback: visibility.createdHabitFeedback,
    createdHabitCount: visibility.createdHabitCount,
    showCreatedHabitFeedback: visibility.showCreatedHabitFeedback,
    rekeyCreatedHabitFeedback: visibility.rekeyCreatedHabitFeedback,
    dismissCreatedHabitFeedback: visibility.dismissCreatedHabitFeedback,

    showHabitDetail: visibility.isHabitDetailOpen,

    onShareMilestone: handlers.onShareMilestone,

    showHapticTest: visibility.showHapticTest,

    showPauseModal: visibility.showPauseModal,

    showQuickActions: visibility.showQuickActions,

    openCreateHabitScreen: handlers.openCreateHabitScreen,

    showSettings: visibility.isSettingsOpen,

    openEditHabit: handlers.openEditHabit,

    openHabitCalendar: handlers.openHabitCalendar,

    showShareCard: visibility.showShareCard,

    openHabitDetail: handlers.openHabitDetail,

    showTemplatesScreen: visibility.showTemplatesScreen,

    openHapticTest: () => {
      visibility.setIsSettingsOpen(false);
      visibility.setShowHapticTest(true);
    },

    showVisualizationExercise: visibility.showVisualizationExercise,

    openPauseModal: handlers.openPauseModal,
    showHabitStrengthPercentage: extra.showHabitStrengthPercentage,
    openQuickActions: handlers.openQuickActions,
    tracking: extra.tracking,
    // Inline open handlers
    openSettings: () => visibility.setIsSettingsOpen(true),

    // Reopening the library cancels any stale focus request.
    openTemplatesScreen: () => {
      visibility.clearPendingFocusHabit();
      visibility.setShowTemplatesScreen(true);
    },

    openVisualizationExercise: handlers.openVisualizationExercise,

    setShowHabitStrengthPercentage: () => {},
    toggleHabit: extra.handleToggleHabit,
  } as unknown as HabitsModalsState;
}
