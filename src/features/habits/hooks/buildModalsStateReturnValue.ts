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
    // Handlers from extracted hook
closeCreateHabit: h.closeCreateHabit,
    
closeEditScreen: h.closeEditScreen,
    
closeQuickActions: h.closeQuickActions,
    
closeShareCard: h.closeShareCard,
    
closeActivationModal: h.closeActivationModal,
    
habitDetailInitialTab: s.habitDetailInitialTab,
    
    closeVisualizationExercise: h.closeVisualizationExercise,

    habits: extra.habits,

    confirmPause: h.confirmPause,

    habitToEdit: s.habitToEdit,

    habitToPause: s.habitToPause,

    milestone: extra.milestone,

    onDeleteHabit: h.onDeleteHabit,

    onSettingsChange: h.onSettingsChange,

    // Extra handlers
onChangeCelebrationsEnabled: extra.onChangeCelebrationsEnabled,

    
quickActionsHabit: s.quickActionsHabit,

    
handleArchive: extra.handleArchive,

    
reduceMotionPreference: extra.reduceMotionPreference,

    
clearMilestone: extra.clearMilestone,

    
selectedHabit: s.selectedHabit,

    
getStreak: extra.getStreak,

    
settings: extra.settings,

    
// Inline close handlers
closeSettings: () => v.setIsSettingsOpen(false),

    

shareCardData: s.shareCardData,

    
    
closeHabitCalendar: () => v.setIsHabitCalendarOpen(false),

    
showActivationModal: v.showActivationModal,

    
closeHabitDetail: () => v.setIsHabitDetailOpen(false),

    
showCreateHabit: v.isCreateHabitOpen,

    
closeHapticTest: () => v.setShowHapticTest(false),

    
showEditScreen: v.showEditScreen,

    
closePauseModal: () => {
      v.setShowPauseModal(false);
      s.setHabitToPause(null);
    },

    
showHabitCalendar: v.isHabitCalendarOpen,

    
    closeTemplatesScreen: () => v.setShowTemplatesScreen(false),

    showHabitDetail: v.isHabitDetailOpen,

    onShareMilestone: h.onShareMilestone,

    showHapticTest: v.showHapticTest,

    openActivationModal: h.openActivationModal,

    showPauseModal: v.showPauseModal,

    openActivationModalById: h.openActivationModalById,

    showQuickActions: v.showQuickActions,

    openCreateHabitScreen: h.openCreateHabitScreen,

    showSettings: v.isSettingsOpen,

    openEditHabit: h.openEditHabit,

    openHabitCalendar: h.openHabitCalendar,

    showShareCard: v.showShareCard,

    openHabitDetail: h.openHabitDetail,

    showTemplatesScreen: v.showTemplatesScreen,

    openHapticTest: () => {
      v.setIsSettingsOpen(false);
      v.setShowHapticTest(true);
    },

    showVisualizationExercise: v.showVisualizationExercise,

    openPauseModal: h.openPauseModal,
    showHabitStrengthPercentage: extra.showHabitStrengthPercentage,
    openQuickActions: h.openQuickActions,
    tracking: extra.tracking,
    // Inline open handlers
    openSettings: () => v.setIsSettingsOpen(true),

    openTemplatesScreen: () => v.setShowTemplatesScreen(true),

    openVisualizationExercise: h.openVisualizationExercise,

    setShowHabitStrengthPercentage: () => {},
    toggleHabit: extra.handleToggleHabit,
  } as unknown as HabitsModalsState;
}
