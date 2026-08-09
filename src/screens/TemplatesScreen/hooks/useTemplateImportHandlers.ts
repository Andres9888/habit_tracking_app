/**
 * Handlers for template preview and import operations
 */

import { useCallback, useEffect, useRef } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useImportFeedback } from './useImportFeedback';
import { useImportRetryRefs } from './useImportRetryRefs';
import { usePreviewHandlers } from './usePreviewHandlers';
import { useImportResultHandler } from './useImportResultHandler';
import { useTemplateImportAction } from './useTemplateImportAction';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';

export function useTemplateImportHandlers(o: UseTemplateImportHandlersOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // One import at a time: the spinner state is a single scalar, so a second
  // concurrent mutation would have its indicator cleared by whichever finishes
  // first — and per-row `disabled` doesn't stop taps on *other* cards.
  const importInFlightRef = useRef(false);
  const { directImportRef, templateImportRef } = useImportRetryRefs();
  const { guardImport, showAlreadyImported, showError, showSuccess } =
    useImportFeedback(o);
  const { handleCustomizeFromPreview, handleTemplatePreview } =
    usePreviewHandlers(o);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const handleImportResult = useImportResultHandler({
    setImportedTemplateIds: o.setImportedTemplateIds,
    showAlreadyImported,
    showError,
    showSuccess,
  });

  const handleDirectImport = useCallback(
    async (id: Id<'templates'>) => {
      if (importInFlightRef.current || guardImport()) return undefined;
      importInFlightRef.current = true;
      try {
        o.setImportingTemplateId(id);
        const res = await o.importTemplate({ templateId: id });
        const outcome = handleImportResult(res, id);
        if (outcome !== 'failed') {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(
            () => o.setShowCustomizeModal(false),
            1000
          );
        }
        return outcome;
      } catch {
        showError(() => void directImportRef.current(id));
        return undefined;
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
      o.setShowCustomizeModal,
      showError,
    ]
  );

  const handleTemplateImport = useTemplateImportAction({
    guardImport,
    handleImportResult,
    inFlightRef: importInFlightRef,
    importTemplate: o.importTemplate,
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
    handleTemplateImport,
    handleTemplatePreview,
  };
}
