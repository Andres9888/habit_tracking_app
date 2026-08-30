/**
 * The callbacks TemplatesScreen hands to its views: import (tagged with the
 * surface it came from, for analytics), feedback dismissal, and the seed /
 * pack-confirm trampolines that swallow the returned promise.
 *
 * These live here rather than in the screen so TemplatesScreen stays a
 * composition root.
 */

import { useCallback, useMemo } from 'react';
import { Keyboard } from 'react-native';
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
  /** Home + scroll-to + highlight; the success toast's "Go to <name>". */
  onGoToHabit?: (habitId: Id<'habits'>) => void;
  onPrepareGoToHabit?: (habitId: Id<'habits'>) => void;
  onCancelPreparedGoToHabit?: () => void;
}

export function useLibraryScreenActions({
  handlers,
  packConfirm,
  state,
  onViewHabit,
  onGoToHabit,
  onPrepareGoToHabit,
  onCancelPreparedGoToHabit,
}: UseLibraryScreenActionsOptions) {
  const {
    dismissFeedback,
    feedbackHabitId,
    feedbackVariant,
    showFeedbackError,
  } = state;

  const handleSaveError = useCallback(
    () => showFeedbackError("Couldn't save your cue. Try again."),
    [showFeedbackError]
  );

  // A freshly added habit lands on Today, scrolled to and highlighted — same
  // exit as the drill-down's primary action. "Already added" keeps opening
  // the detail screen: its copy promises progress + plan, not the list.
  const handleViewHabit = useCallback(() => {
    if (feedbackHabitId) {
      if (feedbackVariant === 'success' && onGoToHabit) {
        onGoToHabit(feedbackHabitId);
      } else {
        onViewHabit?.(feedbackHabitId);
      }
    }
    dismissFeedback();
  }, [
    dismissFeedback,
    feedbackHabitId,
    feedbackVariant,
    onGoToHabit,
    onViewHabit,
  ]);

  const makeImportHandler = useCallback(
    (source: TemplateImportSource) => (template: Doc<'templates'>) => {
      trackLibraryEvent({
        type: 'template_added',
        templateId: template._id,
        source,
      });
      state.setPreviewTemplate(template);
      // List Add stays on the catalog. Its success surface is the temporary,
      // list-owned TemplateAddedToast; only the drill-down uses inline mode.
      // The bottom-anchored toast sits under the iOS keyboard, and its
      // "Go to habit" CTA makes the keyboard dead weight after Add.
      Keyboard.dismiss();
      onCancelPreparedGoToHabit?.();
      void handlers
        .handleDirectImport(template._id, 'list', template)
        .then((result) => {
          if (result?.success && !result.alreadyExists && result.habitId) {
            onPrepareGoToHabit?.(result.habitId);
          }
        });
    },
    [handlers, onCancelPreparedGoToHabit, onPrepareGoToHabit, state]
  );

  const handlePopularImport = useMemo(
    () => makeImportHandler('popular'),
    [makeImportHandler]
  );

  const handleDetailsDirectImport = useCallback(
    async (id: Id<'templates'>) => {
      trackLibraryEvent({
        type: 'template_added',
        templateId: id,
        source: 'details',
      });
      // The drill-down owns its persistent post-add confirmation. Success is
      // inline here so no overlay competes with it; failures still use the
      // shared error toast.
      await handlers.handleDirectImport(id, 'inline');
    },
    [handlers]
  );

  const handleSeedTemplates = useCallback(() => {
    void handlers.handleSeedTemplates();
  }, [handlers]);

  const handlePackConfirm = useCallback(() => {
    void packConfirm.handleConfirm();
  }, [packConfirm]);

  const handleAddAnother = useCallback(() => {
    onCancelPreparedGoToHabit?.();
    dismissFeedback();
  }, [dismissFeedback, onCancelPreparedGoToHabit]);

  return {
    handleAddAnother,
    handleDetailsDirectImport,
    handleDismissFeedback: dismissFeedback,
    handlePackConfirm,
    handlePopularImport,
    handleSaveError,
    handleSeedTemplates,
    handleViewHabit,
  };
}
