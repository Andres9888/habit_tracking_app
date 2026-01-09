import type { HabitsModalsState } from './types';
import type { ModalVisibilityState } from './useModalVisibilityState';
import type { HabitSelectionState } from './useHabitSelectionState';
import type {
  HandlersReturn,
  ExtraState,
} from './buildModalsStateReturnValue.types';

export function buildModalsStateReturnValue(
  v: ModalVisibilityState,
  s: HabitSelectionState,
  h: HandlersReturn,
  extra: ExtraState
): HabitsModalsState {
  return {
    activationModalHabit: s.activationModalHabit,
    // State properties
    celebrationsEnabled: extra.celebrationsEnabled,
    habitDetailInitialTab: s.habitDetailInitialTab,
    habits: extra.habits,
    habitToEdit: s.habitToEdit,
    habitToPause: s.habitToPause,
    milestone: extra.milestone,
    quickActionsHabit: s.quickActionsHabit,
    // Handlers from extracted hook
    closeCreateHabit: h.closeCreateHabit,

    reduceMotionPreference: extra.reduceMotionPreference,

    closeEditScreen: h.closeEditScreen,

    selectedHabit: s.selectedHabit,

    closeQuickActions: h.closeQuickActions,

    settings: extra.settings,

    closeShareCard: h.closeShareCard,

    shareCardData: s.shareCardData,

    closeActivationModal: h.closeActivationModal,

    showActivationModal: v.showActivationModal,

    closeVisualizationExercise: h.closeVisualizationExercise,

    showCreateHabit: v.isCreateHabitOpen,

    confirmPause: h.confirmPause,

    showEditScreen: v.showEditScreen,

    onDeleteHabit: h.onDeleteHabit,

    showHabitCalendar: v.isHabitCalendarOpen,

    onSettingsChange: h.onSettingsChange,

    showHabitDetail: v.isHabitDetailOpen,

    // Extra handlers
    onChangeCelebrationsEnabled: extra.onChangeCelebrationsEnabled,

    showHapticTest: v.showHapticTest,

    handleArchive: extra.handleArchive,

    showPauseModal: v.showPauseModal,

    clearMilestone: extra.clearMilestone,

    showQuickActions: v.showQuickActions,

    getStreak: extra.getStreak,

    showSettings: v.isSettingsOpen,

    // Inline close handlers
    closeSettings: () => v.setIsSettingsOpen(false),

    closeHabitCalendar: () => v.setIsHabitCalendarOpen(false),

    showShareCard: v.showShareCard,

    closeHabitDetail: () => v.setIsHabitDetailOpen(false),

    showTemplatesScreen: v.showTemplatesScreen,

    closeHapticTest: () => v.setShowHapticTest(false),

    showVisualizationExercise: v.showVisualizationExercise,

    closePauseModal: () => {
      v.setShowPauseModal(false);
      s.setHabitToPause(null);
    },

    showHabitStrengthPercentage: extra.showHabitStrengthPercentage,

    closeTemplatesScreen: () => v.setShowTemplatesScreen(false),

    tracking: extra.tracking,

    onShareMilestone: h.onShareMilestone,

    openActivationModal: h.openActivationModal,

    openActivationModalById: h.openActivationModalById,

    openCreateHabitScreen: h.openCreateHabitScreen,

    openEditHabit: h.openEditHabit,

    openHabitCalendar: h.openHabitCalendar,

    openHabitDetail: h.openHabitDetail,
    openHapticTest: () => {
      v.setIsSettingsOpen(false);
      v.setShowHapticTest(true);
    },
    openPauseModal: h.openPauseModal,
    openQuickActions: h.openQuickActions,
    // Inline open handlers
    openSettings: () => v.setIsSettingsOpen(true),

    openTemplatesScreen: () => v.setShowTemplatesScreen(true),

    openVisualizationExercise: h.openVisualizationExercise,

    setShowHabitStrengthPercentage: () => {},
    toggleHabit: extra.handleToggleHabit,
  } as HabitsModalsState;
}
