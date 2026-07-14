import { Suspense } from 'react';

import ErrorBoundary from '../../../../components/ErrorBoundary';
import type { HabitsModalsProps } from './HabitsModals.types';
import {
  ShareAndPauseModals,
  TemplatesModalSection,
  VisualizationModalSection,
} from './HabitsModals.lazy';
import { getShareAndPauseProps } from './HabitsModals.helpers';
import { TemplatesModalFallback } from './TemplatesModalFallback';
import { useRetainedModalMount } from './useRetainedModalMount';

// eslint-disable-next-line max-lines-per-function
export function SecondaryModalSections({ state }: HabitsModalsProps) {
  const mountShareAndPause = useRetainedModalMount(
    state.showShareCard || state.showPauseModal
  );
  const mountTemplates = useRetainedModalMount(state.showTemplatesScreen);
  const mountVisualization = useRetainedModalMount(
    state.showVisualizationExercise
  );

  return (
    <>
      {mountShareAndPause ? (
        <Suspense fallback={null}>
          <ShareAndPauseModals {...getShareAndPauseProps(state)} />
        </Suspense>
      ) : null}
      {mountTemplates ? (
        <ErrorBoundary fallback={null}>
          <Suspense
            fallback={
              <TemplatesModalFallback
                visible={state.showTemplatesScreen}
                onClose={state.closeTemplatesScreen}
              />
            }
          >
            <TemplatesModalSection
              closeTemplatesScreen={state.closeTemplatesScreen}
              habits={state.habits}
              openHabitDetail={state.openHabitDetail}
              reduceMotionPreference={state.reduceMotionPreference}
              showTemplatesScreen={state.showTemplatesScreen}
            />
          </Suspense>
        </ErrorBoundary>
      ) : null}
      {mountVisualization ? (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <VisualizationModalSection
              closeVisualizationExercise={state.closeVisualizationExercise}
              selectedHabit={state.selectedHabit}
              showVisualizationExercise={state.showVisualizationExercise}
            />
          </Suspense>
        </ErrorBoundary>
      ) : null}
    </>
  );
}
