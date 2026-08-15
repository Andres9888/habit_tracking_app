/**
 * Handlers for template preview and import operations
 */

import { useCallback, useRef } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { useDismissCustomizeTimeout } from './useDismissCustomizeTimeout';
import { useImportFeedback } from './useImportFeedback';
import { useImportedHabitTargets } from './useImportedHabitTargets';
import { useImportRetryRefs } from './useImportRetryRefs';
import { usePreviewHandlers } from './usePreviewHandlers';
import {
  useImportResultHandler,
  type ImportFeedbackMode,
} from './useImportResultHandler';
import { useTemplateImportAction } from './useTemplateImportAction';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';

export function useTemplateImportHandlers(o: UseTemplateImportHandlersOptions) {
  // The spinner state is scalar, so serialize imports across all cards.
  const importInFlightRef = useRef(false);
  // Resolve focus from the open template, never a global last-added ID.
  const { importedHabitIdsByTemplateRef, recordImportedHabit } =
    useImportedHabitTargets(o.initialImportedHabitIds);
  const { directImportRef, templateImportRef } = useImportRetryRefs();
  const { guardImport, showAlreadyImported, showError, showSuccess } =
    useImportFeedback(o);
  const { handleCustomizeFromPreview, handleTemplatePreview } =
    usePreviewHandlers(o);
  const scheduleCustomizeDismiss = useDismissCustomizeTimeout(() =>
    o.setShowCustomizeModal(false)
  );

  const handleImportResult = useImportResultHandler({
    setImportedTemplateIds: o.setImportedTemplateIds,
    showAlreadyImported,
    showError,
    showSuccess,
  });

  const handleDirectImport = useCallback(
    async (
      id: Id<'templates'>,
      feedbackMode: ImportFeedbackMode = 'overlay',
      feedbackTemplate?: Doc<'templates'> | null
    ) => {
      if (importInFlightRef.current || guardImport()) return;
      importInFlightRef.current = true;
      try {
        o.setImportingTemplateId(id);
        const res = await o.importTemplate({ templateId: id });
        const outcome = handleImportResult(
          res,
          id,
          feedbackMode,
          feedbackTemplate
        );
        if (outcome !== 'failed') recordImportedHabit(id, res.habitId);
        if (outcome !== 'failed') scheduleCustomizeDismiss();
        return outcome;
      } catch {
        showError(
          () => void directImportRef.current(id, feedbackMode, feedbackTemplate)
        );
        return;
      } finally {
        importInFlightRef.current = false;
        o.setImportingTemplateId(null);
      }
    },
    [
      directImportRef,
      guardImport,
      handleImportResult,
      o.importTemplate,
      o.setImportingTemplateId,
      recordImportedHabit,
      scheduleCustomizeDismiss,
      showError,
    ]
  );

  const handleTemplateImport = useTemplateImportAction({
    guardImport,
    handleImportResult,
    inFlightRef: importInFlightRef,
    importTemplate: o.importTemplate,
    recordImportedHabit,
    setImportingTemplateId: o.setImportingTemplateId,
    setShowCustomizeModal: o.setShowCustomizeModal,
    showError,
    templateImportRef,
  });

  directImportRef.current = handleDirectImport;
  templateImportRef.current = handleTemplateImport;

  return {
    handleCustomizeFromPreview,
    handleDirectImport,
    importedHabitIdsByTemplateRef,
    handleTemplateImport,
    handleTemplatePreview,
    recordImportedHabit,
  };
}
