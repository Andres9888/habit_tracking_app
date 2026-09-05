import type { HabitsModalsState } from './types';
import type { ModalVisibilityState } from './useModalVisibilityState';
import type { HabitSelectionState } from './useHabitSelectionState';
import type { ModalsStableHandlers } from './useModalsStableHandlers';
import type {
  HandlersReturn,
  ExtraState,
} from './buildModalsStateReturnValue.types';

/**
 * Builds the complete HabitsModalsState return value by combining visibility state,
 * selection state, handlers, and extra state into a unified interface.
 *
 * Every value here must already be stable (see `useModalsStableHandlers` for
 * the open/close closures) — the caller memoises the object this returns, and
 * an inline closure would silently defeat that.
 *
 * @param visibility - Modal visibility state (open/close flags)
 * @param selection - Currently selected habits for various modals
 * @param handlers - Event handlers for modal interactions
 * @param stable - Memoised open/close closures over visibility + selection
 * @param extra - Additional state like settings, habits list, tracking functions
 * @returns Complete HabitsModalsState object with all modal-related state and handlers
 */
export function buildModalsStateReturnValue(
  visibility: ModalVisibilityState,
  selection: HabitSelectionState,
  handlers: HandlersReturn,
  stable: ModalsStableHandlers,
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

    // Memoised close handlers
    closeSettings: stable.closeSettings,

    shareCardData: selection.shareCardData,

    closeHabitCalendar: stable.closeHabitCalendar,

    closeHabitDetail: stable.closeHabitDetail,

    showCreateHabit: visibility.isCreateHabitOpen,

    closeHapticTest: stable.closeHapticTest,

    showEditScreen: visibility.showEditScreen,

    closePauseModal: stable.closePauseModal,

    showHabitCalendar: visibility.isHabitCalendarOpen,

    closeTemplatesScreen: stable.closeTemplatesScreen,

    // Focus request raised by the Habit Library's post-add primary action.
    // NOTE: this builder ends in `as unknown as HabitsModalsState`, so tsc
    // will NOT flag a field declared in the type but missing here.
    pendingFocusHabitId: visibility.pendingFocusHabitId,
    focusReady: visibility.focusReady,
    focusRequestAutoClose: visibility.focusRequestAutoClose,

    prepareFocusHabitOnHome: stable.prepareFocusHabitOnHome,

    commitFocusHabitOnHome: stable.commitFocusHabitOnHome,

    markFocusHabitReady: stable.markFocusHabitReady,

    clearPendingFocusHabit: visibility.clearPendingFocusHabit,

    // The add-habit form's variant: same request, commits itself when ready.
    focusRekey: visibility.focusRekey,
    focusRequestKey: visibility.focusRequestKey,
    prepareCreatedHabitFocus: visibility.prepareCreatedHabitFocus,
    createdFocusPending: visibility.createdFocusPending,
    rekeyPendingFocusHabit: visibility.rekeyPendingFocusHabit,

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

    openHapticTest: stable.openHapticTest,

    showVisualizationExercise: visibility.showVisualizationExercise,

    openPauseModal: handlers.openPauseModal,
    showHabitStrengthPercentage: extra.showHabitStrengthPercentage,
    openQuickActions: handlers.openQuickActions,
    tracking: extra.tracking,
    // Memoised open handlers
    openSettings: stable.openSettings,

    openTemplatesScreen: stable.openTemplatesScreen,

    openVisualizationExercise: handlers.openVisualizationExercise,

    setShowHabitStrengthPercentage: stable.setShowHabitStrengthPercentage,
    toggleHabit: extra.handleToggleHabit,
  } as unknown as HabitsModalsState;
}
