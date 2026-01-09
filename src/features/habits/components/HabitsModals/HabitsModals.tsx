import type { HabitsModalsProps } from './HabitsModals.types';
import { SettingsModalSection } from './SettingsModalSection';
import { CreateHabitModalSection } from './CreateHabitModalSection';
import { HapticTestModalSection } from './HapticTestModalSection';
import { CalendarAndDetailModals } from './CalendarAndDetailModals';
import { ShareAndPauseModals } from './ShareAndPauseModals';
import { TemplatesModalSection } from './TemplatesModalSection';
import { QuickActionsSection } from './QuickActionsSection';
import { VisualizationModalSection } from './VisualizationModalSection';
import { ActivationModalSection } from './ActivationModalSection';

/** HabitsModals - Orchestrator component for all habit-related modals */
export function HabitsModals({ state }: HabitsModalsProps) {
  const { selectedHabit, habitToEdit, tracking, toggleHabit } = state;
  const { openHabitDetail, openEditHabit, openPauseModal, openHabitCalendar } =
    state;
  const { showSettings, showCreateHabit, showHapticTest, showHabitCalendar } =
    state;
  const { showHabitDetail, showEditScreen, showShareCard, showPauseModal } =
    state;
  const {
    showTemplatesScreen,
    showQuickActions,
    showVisualizationExercise,
    showActivationModal,
  } = state;

  return (
    <>
      <SettingsModalSection
        celebrationsEnabled={state.celebrationsEnabled}
        closeSettings={state.closeSettings}
        openHapticTest={state.openHapticTest}
        setShowHabitStrengthPercentage={state.setShowHabitStrengthPercentage}
        settings={state.settings}
        showHabitStrengthPercentage={state.showHabitStrengthPercentage}
        showSettings={showSettings}
        onSettingsChange={state.onSettingsChange}
      />
      <CreateHabitModalSection
        closeCreateHabit={state.closeCreateHabit}
        habitToEdit={habitToEdit}
        showCreateHabit={showCreateHabit}
      />
      <HapticTestModalSection
        closeHapticTest={state.closeHapticTest}
        showHapticTest={showHapticTest}
      />
      <CalendarAndDetailModals
        closeEditScreen={state.closeEditScreen}
        closeHabitCalendar={state.closeHabitCalendar}
        closeHabitDetail={state.closeHabitDetail}
        getStreak={state.getStreak}
        habitToEdit={habitToEdit}
        handleArchive={state.handleArchive}
        openEditHabit={openEditHabit}
        openHabitCalendar={openHabitCalendar}
        openHabitDetail={openHabitDetail}
        openPauseModal={openPauseModal}
        selectedHabit={selectedHabit}
        showEditScreen={showEditScreen}
        showHabitCalendar={showHabitCalendar}
        showHabitDetail={showHabitDetail}
        toggleHabit={toggleHabit}
        tracking={tracking}
        onDeleteHabit={state.onDeleteHabit}
      />
      <ShareAndPauseModals
        closePauseModal={state.closePauseModal}
        closeShareCard={state.closeShareCard}
        confirmPause={state.confirmPause}
        habitToPause={state.habitToPause}
        shareCardData={state.shareCardData}
        showPauseModal={showPauseModal}
        showShareCard={showShareCard}
      />
      <TemplatesModalSection
        closeTemplatesScreen={state.closeTemplatesScreen}
        showTemplatesScreen={showTemplatesScreen}
      />
      <QuickActionsSection
        closeQuickActions={state.closeQuickActions}
        openEditHabit={openEditHabit}
        openHabitCalendar={openHabitCalendar}
        openHabitDetail={openHabitDetail}
        openPauseModal={openPauseModal}
        openVisualizationExercise={state.openVisualizationExercise}
        quickActionsHabit={state.quickActionsHabit}
        showQuickActions={showQuickActions}
        toggleHabit={toggleHabit}
        tracking={tracking}
        onDeleteHabit={state.onDeleteHabit}
      />
      <VisualizationModalSection
        closeVisualizationExercise={state.closeVisualizationExercise}
        selectedHabit={selectedHabit}
        showVisualizationExercise={showVisualizationExercise}
      />
      <ActivationModalSection
        activationModalHabit={state.activationModalHabit}
        closeActivationModal={state.closeActivationModal}
        reduceMotionPreference={state.reduceMotionPreference}
        showActivationModal={showActivationModal}
        toggleHabit={toggleHabit}
      />
    </>
  );
}

export default HabitsModals;
