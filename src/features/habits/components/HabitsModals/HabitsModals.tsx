import type { HabitsModalsProps } from './HabitsModals.types';
import { ActivationModalSection } from './ActivationModalSection';
import { CalendarAndDetailModals } from './CalendarAndDetailModals';
import { CreateHabitModalSection } from './CreateHabitModalSection';
import { HapticTestModalSection } from './HapticTestModalSection';
import { QuickActionsSection } from './QuickActionsSection';
import { SettingsModalSection } from './SettingsModalSection';
import { ShareAndPauseModals } from './ShareAndPauseModals';
import { TemplatesModalSection } from './TemplatesModalSection';
import { VisualizationModalSection } from './VisualizationModalSection';
import {
  getCalendarAndDetailProps,
  getQuickActionsProps,
  getSettingsProps,
  getShareAndPauseProps,
} from './HabitsModals.helpers';

export function HabitsModals({ state }: HabitsModalsProps) {
  return (
    <>
      <SettingsModalSection {...getSettingsProps(state)} />
      <CreateHabitModalSection
        closeCreateHabit={state.closeCreateHabit}
        habitToEdit={state.habitToEdit}
        showCreateHabit={state.showCreateHabit}
      />
      <HapticTestModalSection
        closeHapticTest={state.closeHapticTest}
        showHapticTest={state.showHapticTest}
      />
      <CalendarAndDetailModals {...getCalendarAndDetailProps(state)} />
      <ShareAndPauseModals {...getShareAndPauseProps(state)} />
      <TemplatesModalSection
        closeTemplatesScreen={state.closeTemplatesScreen}
        showTemplatesScreen={state.showTemplatesScreen}
      />
      <QuickActionsSection {...getQuickActionsProps(state)} />
      <VisualizationModalSection
        closeVisualizationExercise={state.closeVisualizationExercise}
        selectedHabit={state.selectedHabit}
        showVisualizationExercise={state.showVisualizationExercise}
      />
      <ActivationModalSection
        activationModalHabit={state.activationModalHabit}
        closeActivationModal={state.closeActivationModal}
        reduceMotionPreference={state.reduceMotionPreference}
        showActivationModal={state.showActivationModal}
        toggleHabit={state.toggleHabit}
      />
    </>
  );
}
export default HabitsModals;
