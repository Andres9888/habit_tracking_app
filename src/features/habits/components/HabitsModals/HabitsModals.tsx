import ErrorBoundary from '../../../../components/ErrorBoundary';
import { ActivationModalSection } from './ActivationModalSection';
import { CalendarAndDetailModals } from './CalendarAndDetailModals';
import { CreateHabitModalSection } from './CreateHabitModalSection';
import { HapticTestModalSection } from './HapticTestModalSection';
import { QuickActionsSection } from './QuickActionsSection';
import { SettingsModalSection } from './SettingsModalSection';
import { ShareAndPauseModals } from './ShareAndPauseModals';
import { TemplatesModalSection } from './TemplatesModalSection';
import type { HabitsModalsProps } from './HabitsModals.types';
import { VisualizationModalSection } from './VisualizationModalSection';
import {
  getCalendarAndDetailProps,
  getQuickActionsProps,
  getSettingsProps,
  getShareAndPauseProps,
} from './HabitsModals.helpers';

export function HabitsModals({ state }: HabitsModalsProps) {
  const shouldRenderCreateHabit = state.showCreateHabit;
  const shouldRenderCalendarAndDetail =
    state.showHabitCalendar || state.showHabitDetail || state.showEditScreen;
  const shouldRenderVisualization = state.showVisualizationExercise;
  const shouldRenderActivation = state.showActivationModal;

  return (
    <>
      <ErrorBoundary fallback={null}>
        <SettingsModalSection {...getSettingsProps(state)} />
      </ErrorBoundary>
      {shouldRenderCreateHabit ? <ErrorBoundary fallback={null}>
          <CreateHabitModalSection
            closeCreateHabit={state.closeCreateHabit}
            habitToEdit={state.habitToEdit}
            showCreateHabit={state.showCreateHabit}
          />
        </ErrorBoundary> : null}
      {__DEV__ ? <ErrorBoundary fallback={null}>
          <HapticTestModalSection
            closeHapticTest={state.closeHapticTest}
            showHapticTest={state.showHapticTest}
          />
        </ErrorBoundary> : null}
      {shouldRenderCalendarAndDetail ? <ErrorBoundary fallback={null}>
          <CalendarAndDetailModals {...getCalendarAndDetailProps(state)} />
        </ErrorBoundary> : null}
      <ShareAndPauseModals {...getShareAndPauseProps(state)} />
      <ErrorBoundary fallback={null}>
        <TemplatesModalSection
          closeTemplatesScreen={state.closeTemplatesScreen}
          reduceMotionPreference={state.reduceMotionPreference}
          showTemplatesScreen={state.showTemplatesScreen}
        />
      </ErrorBoundary>
      <QuickActionsSection {...getQuickActionsProps(state)} />
      {shouldRenderVisualization ? <ErrorBoundary fallback={null}>
          <VisualizationModalSection
            closeVisualizationExercise={state.closeVisualizationExercise}
            selectedHabit={state.selectedHabit}
            showVisualizationExercise={state.showVisualizationExercise}
          />
        </ErrorBoundary> : null}
      {shouldRenderActivation ? <ErrorBoundary fallback={null}>
          <ActivationModalSection
            activationModalHabit={state.activationModalHabit}
            closeActivationModal={state.closeActivationModal}
            reduceMotionPreference={state.reduceMotionPreference}
            showActivationModal={state.showActivationModal}
            toggleHabit={state.toggleHabit}
          />
        </ErrorBoundary> : null}
    </>
  );
}
export default HabitsModals;
