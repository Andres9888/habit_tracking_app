import ErrorBoundary from '../../../../components/ErrorBoundary';
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
  const shouldRenderVisualization = state.showVisualizationExercise;

  return (
    <>
      <ErrorBoundary fallback={null}>
        <SettingsModalSection {...getSettingsProps(state)} />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <CreateHabitModalSection
          closeCreateHabit={state.closeCreateHabit}
          habitToEdit={state.habitToEdit}
          showCreateHabit={state.showCreateHabit}
        />
      </ErrorBoundary>
      {__DEV__ ? (
        <ErrorBoundary fallback={null}>
          <HapticTestModalSection
            closeHapticTest={state.closeHapticTest}
            showHapticTest={state.showHapticTest}
          />
        </ErrorBoundary>
      ) : null}
      <ErrorBoundary fallback={null}>
        <CalendarAndDetailModals {...getCalendarAndDetailProps(state)} />
      </ErrorBoundary>
      <ShareAndPauseModals {...getShareAndPauseProps(state)} />
      <ErrorBoundary fallback={null}>
        <TemplatesModalSection
          closeTemplatesScreen={state.closeTemplatesScreen}
          showTemplatesScreen={state.showTemplatesScreen}
        />
      </ErrorBoundary>
      <QuickActionsSection {...getQuickActionsProps(state)} />
      {shouldRenderVisualization ? (
        <ErrorBoundary fallback={null}>
          <VisualizationModalSection
            closeVisualizationExercise={state.closeVisualizationExercise}
            selectedHabit={state.selectedHabit}
            showVisualizationExercise={state.showVisualizationExercise}
          />
        </ErrorBoundary>
      ) : null}
    </>
  );
}
export default HabitsModals;
