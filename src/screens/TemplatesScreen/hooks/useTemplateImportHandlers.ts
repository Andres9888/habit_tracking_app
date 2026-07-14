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
import { useTemplateImportTracker } from './useTemplateImportTracker';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';
import {
  trackLibraryEvent,
  type TemplateImportSource,
} from '../utils/libraryAnalytics';

export function useTemplateImportHandlers(o: UseTemplateImportHandlersOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { directImportRef, templateImportRef } = useImportRetryRefs();
  const { finishImport, startImport } = useTemplateImportTracker(
    o.setImportingTemplateIds
  );
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
    async (id: Id<'templates'>, source: TemplateImportSource = 'catalog') => {
      if (guardImport() || !startImport(id)) return;
      try {
        const res = await o.importTemplate({ source, templateId: id });
        const result = handleImportResult(res, id);
        if (result === 'imported') {
          trackLibraryEvent({ type: 'template_added', templateId: id, source });
        }
        if (result !== 'failed') {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(
            () => o.setShowCustomizeModal(false),
            1000
          );
        }
      } catch {
        showError(() => void directImportRef.current(id, source));
      } finally {
        finishImport(id);
      }
    },
    [
      directImportRef,
      finishImport,
      guardImport,
      handleImportResult,
      o.importTemplate,
      o.setShowCustomizeModal,
      showError,
      startImport,
    ]
  );

  const handleTemplateImport = useTemplateImportAction({
    guardImport,
    finishImport,
    handleImportResult,
    importTemplate: o.importTemplate,
    setShowCustomizeModal: o.setShowCustomizeModal,
    showError,
    startImport,
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
