import { Suspense } from 'react';

import ErrorBoundary from '../../../../components/ErrorBoundary';
import { SettingsModalLoadingFallback } from '../../../../components/SettingsModal/components/SettingsModalFallback';
import type { HabitsModalsProps } from './HabitsModals.types';
import {
  CalendarAndDetailModals,
  HapticTestModalSection,
  SettingsModalSection,
} from './HabitsModals.lazy';
import {
  getCalendarAndDetailProps,
  getSettingsProps,
} from './HabitsModals.helpers';
import { useRetainedModalMount } from './useRetainedModalMount';

export function PrimaryModalSections({ state }: HabitsModalsProps) {
  const mountSettings = useRetainedModalMount(state.showSettings);
  const mountHapticTest = useRetainedModalMount(state.showHapticTest);
  const mountCalendarAndDetail = useRetainedModalMount(
    state.showHabitCalendar || state.showHabitDetail || state.showEditScreen
  );

  return (
    <>
      {mountSettings ? (
        <ErrorBoundary fallback={null}>
          <Suspense
            fallback={
              <SettingsModalLoadingFallback
                visible={state.showSettings}
                onClose={state.closeSettings}
              />
            }
          >
            <SettingsModalSection {...getSettingsProps(state)} />
          </Suspense>
        </ErrorBoundary>
      ) : null}
      {__DEV__ && mountHapticTest ? (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <HapticTestModalSection
              closeHapticTest={state.closeHapticTest}
              showHapticTest={state.showHapticTest}
            />
          </Suspense>
        </ErrorBoundary>
      ) : null}
      {mountCalendarAndDetail ? (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <CalendarAndDetailModals {...getCalendarAndDetailProps(state)} />
          </Suspense>
        </ErrorBoundary>
      ) : null}
    </>
  );
}
