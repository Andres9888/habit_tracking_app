/**
 * The callbacks TemplatesScreen hands to its views: import (tagged with the
 * surface it came from, for analytics), feedback dismissal, and the seed /
 * pack-confirm trampolines that swallow the returned promise.
 *
 * These live here rather than in the screen so TemplatesScreen stays a
 * composition root.
 */

import { useCallback, useMemo } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import {
  trackLibraryEvent,
  type TemplateImportSource,
} from '../utils/libraryAnalytics';
import type { useTemplatesScreenProps } from './useTemplatesScreenProps';

type ScreenProps = ReturnType<typeof useTemplatesScreenProps>;

interface UseLibraryScreenActionsOptions {
  handlers: ScreenProps['handlers'];
  packConfirm: ScreenProps['packConfirm'];
  state: ScreenProps['state'];
  onViewHabit?: (habitId: Id<'habits'>) => void;
}

export function useLibraryScreenActions({
  handlers,
  packConfirm,
  state,
  onViewHabit,
}: UseLibraryScreenActionsOptions) {
  const { dismissFeedback, feedbackHabitId, showFeedbackError } = state;

  const handleSaveError = useCallback(
    () => showFeedbackError("Couldn't save your cue. Try again."),
    [showFeedbackError]
  );

  const handleViewHabit = useCallback(() => {
    if (feedbackHabitId) onViewHabit?.(feedbackHabitId);
    dismissFeedback();
  }, [dismissFeedback, feedbackHabitId, onViewHabit]);

  const makeImportHandler = useCallback(
    (source: TemplateImportSource) => (template: Doc<'templates'>) => {
      state.setPreviewTemplate(template);
      // Tracked on the confirmed outcome, not on the tap — failed and
      // duplicate imports must not count as adds.
      void handlers
        .handleDirectImport(template._id, 'overlay', template)
        .then((outcome) => {
          if (outcome === 'added') {
            trackLibraryEvent({
              type: 'template_added',
              templateId: template._id,
              source,
            });
          }
        });
    },
    [handlers, state]
  );

  const handlePopularImport = useMemo(
    () => makeImportHandler('popular'),
    [makeImportHandler]
  );

  const handleDetailsDirectImport = useCallback(
    async (id: Id<'templates'>) => {
      // The drill-down owns its persistent post-add confirmation. Keeping
      // success inline prevents the toast / first-import cue sheet from
      // stacking over the same state. Errors still use the shared toast.
      const outcome = await handlers.handleDirectImport(id, 'inline');
      if (outcome === 'added') {
        trackLibraryEvent({
          type: 'template_added',
          templateId: id,
          source: 'details',
        });
      }
      return outcome;
    },
    [handlers]
  );

  const handleSeedTemplates = useCallback(() => {
    void handlers.handleSeedTemplates();
  }, [handlers]);

  const handlePackConfirm = useCallback(() => {
    void packConfirm.handleConfirm();
  }, [packConfirm]);

  return {
    handleAddAnother: dismissFeedback,
    handleDetailsDirectImport,
    handleDismissFeedback: dismissFeedback,
    handlePackConfirm,
    handlePopularImport,
    handleSaveError,
    handleSeedTemplates,
    handleViewHabit,
  };
}
