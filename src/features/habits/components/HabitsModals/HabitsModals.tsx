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

// Helper to load modal components with error handling
const lazyModal = (
  importFn: () => Promise<{ [key: string]: React.ComponentType<any> }>,
  name: string
) =>
  lazy(() =>
    importFn().catch((error) => {
      if (__DEV__) console.error(`Failed to load ${name}:`, error);
      throw error;
    })
  );

// Lazy-load heavy modal sections with error handling
const CalendarAndDetailModals = lazyModal(
  () => import('./CalendarAndDetailModals').then((m) => ({ default: m.CalendarAndDetailModals })),
  'CalendarAndDetailModals'
);
const TemplatesModalSection = lazyModal(
  () => import('./TemplatesModalSection').then((m) => ({ default: m.TemplatesModalSection })),
  'TemplatesModalSection'
);
const VisualizationModalSection = lazyModal(
  () => import('./VisualizationModalSection').then((m) => ({ default: m.VisualizationModalSection })),
  'VisualizationModalSection'
);
const ActivationModalSection = lazyModal(
  () => import('./ActivationModalSection').then((m) => ({ default: m.ActivationModalSection })),
  'ActivationModalSection'
);
const HapticTestModalSection = lazyModal(
  () => import('./HapticTestModalSection').then((m) => ({ default: m.HapticTestModalSection })),
  'HapticTestModalSection'
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
