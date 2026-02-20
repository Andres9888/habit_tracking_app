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
    activationModalHabit: selection.activationModalHabit,
    archivedHabitsCount: extra.archivedHabitsCount,
    // State properties
    celebrationsEnabled: extra.celebrationsEnabled,
    // Handlers from extracted hook
    closeCreateHabit: handlers.closeCreateHabit,

    closeEditScreen: handlers.closeEditScreen,

    closeQuickActions: handlers.closeQuickActions,

    closeShareCard: handlers.closeShareCard,

    closeActivationModal: handlers.closeActivationModal,

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

    showActivationModal: visibility.showActivationModal,

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

    showHabitDetail: visibility.isHabitDetailOpen,

    onShareMilestone: handlers.onShareMilestone,

    showHapticTest: visibility.showHapticTest,

    openActivationModal: handlers.openActivationModal,

    showPauseModal: visibility.showPauseModal,

    openActivationModalById: handlers.openActivationModalById,

    showQuickActions: visibility.showQuickActions,

    openCreateHabitScreen: handlers.openCreateHabitScreen,

    showSettings: visibility.isSettingsOpen,

    showSortSheet: visibility.isSortSheetOpen,

    openSortSheet: () => visibility.setIsSortSheetOpen(true),

    closeSortSheet: () => visibility.setIsSortSheetOpen(false),

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

    openTemplatesScreen: () => visibility.setShowTemplatesScreen(true),

    openVisualizationExercise: handlers.openVisualizationExercise,

    setShowHabitStrengthPercentage: () => {},
    toggleHabit: extra.handleToggleHabit,
  } as unknown as HabitsModalsState;
}
