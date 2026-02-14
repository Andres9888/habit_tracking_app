import { lazy, Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import type { HabitsModalsProps } from './HabitsModals.types';
import { CreateHabitModalSection } from './CreateHabitModalSection';
import { QuickActionsSection } from './QuickActionsSection';
import {
  getCalendarAndDetailProps,
  getQuickActionsProps,
  getSettingsProps,
  getShareAndPauseProps,
} from './HabitsModals.helpers';

// PERF FIX: Lazy-load heavy modal components that are rarely opened.
// These modals are rendered in the component tree but only visible on user action.
// Lazy loading saves ~80KB+ from the initial bundle parse/eval.
const ActivationModalSection = lazy(() =>
  import('./ActivationModalSection').then((m) => ({ default: m.ActivationModalSection }))
);
const CalendarAndDetailModals = lazy(() =>
  import('./CalendarAndDetailModals').then((m) => ({ default: m.CalendarAndDetailModals }))
);
const SettingsModalSection = lazy(() =>
  import('./SettingsModalSection').then((m) => ({ default: m.SettingsModalSection }))
);
const ShareAndPauseModals = lazy(() =>
  import('./ShareAndPauseModals').then((m) => ({ default: m.ShareAndPauseModals }))
);
const TemplatesModalSection = lazy(() =>
  import('./TemplatesModalSection').then((m) => ({ default: m.TemplatesModalSection }))
);
const VisualizationModalSection = lazy(() =>
  import('./VisualizationModalSection').then((m) => ({ default: m.VisualizationModalSection }))
);
const HapticTestModalSection = lazy(() =>
  import('./HapticTestModalSection').then((m) => ({ default: m.HapticTestModalSection }))
);

function ModalFallback() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="small" />
    </View>
  );
}

export function HabitsModals({ state }: HabitsModalsProps) {
  return (
    <Suspense fallback={<ModalFallback />}>
      <SettingsModalSection {...getSettingsProps(state)} />
      <CreateHabitModalSection
        closeCreateHabit={state.closeCreateHabit}
        habitToEdit={state.habitToEdit}
        showCreateHabit={state.showCreateHabit}
      />
      {__DEV__ && (
        <HapticTestModalSection
          closeHapticTest={state.closeHapticTest}
          showHapticTest={state.showHapticTest}
        />
      )}
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
    </Suspense>
  );
}
export default HabitsModals;
