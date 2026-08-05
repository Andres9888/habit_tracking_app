import type { ModalVisibilityState } from './useModalVisibilityState';
import type { HabitSelectionState } from './useHabitSelectionState';

/**
 * Builds the setters argument required by useHabitsModalsHandlers.
 * Extracts setter functions from visibility and selection state hooks.
 */
export function buildModalsSettersArg(
  v: ModalVisibilityState,
  s: HabitSelectionState
) {
  return {
    setHabitDetailInitialTab: s.setHabitDetailInitialTab,
    setHabitToEdit: s.setHabitToEdit,
    setHabitToPause: s.setHabitToPause,
    setIsCreateHabitOpen: v.setIsCreateHabitOpen,
    setIsHabitCalendarOpen: v.setIsHabitCalendarOpen,
    setIsHabitDetailOpen: v.setIsHabitDetailOpen,
    setQuickActionsHabit: s.setQuickActionsHabit,
    setSelectedHabit: s.setSelectedHabit,
    setShareCardData: s.setShareCardData,
    setShowEditScreen: v.setShowEditScreen,
    setShowPauseModal: v.setShowPauseModal,
    setShowQuickActions: v.setShowQuickActions,
    setShowShareCard: v.setShowShareCard,
    setShowVisualizationExercise: v.setShowVisualizationExercise,
  };
}
