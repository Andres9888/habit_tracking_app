import type { HabitsModalsProps } from './HabitsModals.types';

export function getSettingsProps(
  state: HabitsModalsProps['state'],
  onPremiumUpsell?: () => void
) {
  return {
    archivedHabitsCount: state.archivedHabitsCount,
    closeSettings: state.closeSettings,
    onPremiumUpsell,
    onSettingsChange: state.onSettingsChange,
    settings: state.settings,
    showSettings: state.showSettings,
  };
}

export function getCalendarAndDetailProps(state: HabitsModalsProps['state']) {
  return {
    closeEditScreen: state.closeEditScreen,
    closeHabitCalendar: state.closeHabitCalendar,
    closeHabitDetail: state.closeHabitDetail,
    getStreak: state.getStreak,
    habitToEdit: state.habitToEdit,
    handleArchive: state.handleArchive,
    onDeleteHabit: state.onDeleteHabit,
    openEditHabit: state.openEditHabit,
    openHabitCalendar: state.openHabitCalendar,
    openHabitDetail: state.openHabitDetail,
    selectedHabit: state.selectedHabit,
    showEditScreen: state.showEditScreen,
    showHabitCalendar: state.showHabitCalendar,
    showHabitDetail: state.showHabitDetail,
    toggleHabit: state.toggleHabit,
    tracking: state.tracking,
  };
}

export function getQuickActionsProps(state: HabitsModalsProps['state']) {
  return {
    closeQuickActions: state.closeQuickActions,
    onDeleteHabit: state.onDeleteHabit,
    openEditHabit: state.openEditHabit,
    openHabitCalendar: state.openHabitCalendar,
    openHabitDetail: state.openHabitDetail,
    openPauseModal: state.openPauseModal,
    openVisualizationExercise: state.openVisualizationExercise,
    quickActionsHabit: state.quickActionsHabit,
    showQuickActions: state.showQuickActions,
    toggleHabit: state.toggleHabit,
    tracking: state.tracking,
  };
}

export function getShareAndPauseProps(state: HabitsModalsProps['state']) {
  return {
    closePauseModal: state.closePauseModal,
    closeShareCard: state.closeShareCard,
    confirmPause: state.confirmPause,
    habitToPause: state.habitToPause,
    shareCardData: state.shareCardData,
    showPauseModal: state.showPauseModal,
    showShareCard: state.showShareCard,
  };
}
