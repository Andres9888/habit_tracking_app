import { lazy, Suspense } from 'react';
import type { HabitsModalsProps } from './HabitsModals.types';
import { CreateHabitModalSection } from './CreateHabitModalSection';
import { QuickActionsSection } from './QuickActionsSection';
import { SettingsModalSection } from './SettingsModalSection';
import { ShareAndPauseModals } from './ShareAndPauseModals';
import {
  getCalendarAndDetailProps,
  getQuickActionsProps,
  getSettingsProps,
  getShareAndPauseProps,
} from './HabitsModals.helpers';

// Lazy-load heavy modal sections — these are rarely opened but contain
// entire screens (detail, edit, calendar, templates, visualization).
// Deferring their parse/eval until first open speeds up initial launch.
const CalendarAndDetailModals = lazy(() =>
  import('./CalendarAndDetailModals').then((m) => ({
    default: m.CalendarAndDetailModals,
  }))
);
const TemplatesModalSection = lazy(() =>
  import('./TemplatesModalSection').then((m) => ({
    default: m.TemplatesModalSection,
  }))
);
const VisualizationModalSection = lazy(() =>
  import('./VisualizationModalSection').then((m) => ({
    default: m.VisualizationModalSection,
  }))
);
const ActivationModalSection = lazy(() =>
  import('./ActivationModalSection').then((m) => ({
    default: m.ActivationModalSection,
  }))
);
const HapticTestModalSection = lazy(() =>
  import('./HapticTestModalSection').then((m) => ({
    default: m.HapticTestModalSection,
  }))
);

export function HabitsModals({ state }: HabitsModalsProps) {
  return (
    <>
      <SettingsModalSection {...getSettingsProps(state)} />
      <CreateHabitModalSection
        closeCreateHabit={state.closeCreateHabit}
        habitToEdit={state.habitToEdit}
        showCreateHabit={state.showCreateHabit}
      />
      {__DEV__ && (
        <Suspense fallback={null}>
          <HapticTestModalSection
            closeHapticTest={state.closeHapticTest}
            showHapticTest={state.showHapticTest}
          />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <CalendarAndDetailModals {...getCalendarAndDetailProps(state)} />
      </Suspense>
      <ShareAndPauseModals {...getShareAndPauseProps(state)} />
      <Suspense fallback={null}>
        <TemplatesModalSection
          closeTemplatesScreen={state.closeTemplatesScreen}
          showTemplatesScreen={state.showTemplatesScreen}
        />
      </Suspense>
      <QuickActionsSection {...getQuickActionsProps(state)} />
      <Suspense fallback={null}>
        <VisualizationModalSection
          closeVisualizationExercise={state.closeVisualizationExercise}
          selectedHabit={state.selectedHabit}
          showVisualizationExercise={state.showVisualizationExercise}
        />
      </Suspense>
      <Suspense fallback={null}>
        <ActivationModalSection
          activationModalHabit={state.activationModalHabit}
          closeActivationModal={state.closeActivationModal}
          reduceMotionPreference={state.reduceMotionPreference}
          showActivationModal={state.showActivationModal}
          toggleHabit={state.toggleHabit}
        />
      </Suspense>
    </>
  );
}
export default HabitsModals;
