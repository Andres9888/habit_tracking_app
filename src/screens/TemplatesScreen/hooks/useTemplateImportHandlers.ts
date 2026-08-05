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
      if (guardImport()) return;
      try {
        o.setImportingTemplateId(id);
        const res = await o.importTemplate({ templateId: id });
        if (handleImportResult(res, id)) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(
            () => o.setShowCustomizeModal(false),
            1000
          );
        }
      } catch {
        showError(() => void directImportRef.current(id));
      } finally {
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
