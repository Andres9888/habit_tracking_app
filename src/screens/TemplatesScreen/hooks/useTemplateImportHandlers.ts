/**
 * Handlers for template preview and import operations
 */

import { useCallback, useEffect, useRef } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import { useImportFeedback } from './useImportFeedback';
import { usePreviewHandlers } from './usePreviewHandlers';
import { useImportResultHandler } from './useImportResultHandler';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';

export function useTemplateImportHandlers(o: UseTemplateImportHandlersOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        showError();
      } finally {
        o.setImportingTemplateId(null);
      }
    },
    [
      guardImport,
      handleImportResult,
      o.importTemplate,
      o.setImportingTemplateId,
      o.setShowCustomizeModal,
      showError,
    ]
  );

  const handleTemplateImport = useCallback(
    async (id: Id<'templates'>, c?: TemplateCustomizations) => {
      if (guardImport()) {
        o.setShowCustomizeModal(false);
        return;
      }
      try {
        o.setImportingTemplateId(id);
        const args = { ...(c ? { customizations: c } : {}), templateId: id };
        const res = await o.importTemplate(args);
        if (handleImportResult(res, id)) {
          o.setShowCustomizeModal(false);
        }
      } catch {
        o.setShowCustomizeModal(false);
        showError();
      } finally {
        o.setImportingTemplateId(null);
      }
    },
    [
      guardImport,
      handleImportResult,
      o.importTemplate,
      o.setImportingTemplateId,
      o.setShowCustomizeModal,
      showError,
    ]
  );

  return {
    handleCustomizeFromPreview,
    handleDirectImport,
    handleTemplateImport,
    handleTemplatePreview,
  };
}
