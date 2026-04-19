/**
 * Handlers for template preview and import operations
 */

import { useCallback, useEffect, useRef } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import { useImportFeedback } from './useImportFeedback';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';

export function useTemplateImportHandlers(o: UseTemplateImportHandlersOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { guardImport, showError, showSuccess } = useImportFeedback(o);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const handleTemplatePreview = useCallback(
    (t: Doc<'templates'>) => {
      o.setPreviewTemplate(t);
      o.setShowFullsizePreview(true);
    },
    [o.setPreviewTemplate, o.setShowFullsizePreview]
  );

  const handleCustomizeFromPreview = useCallback(
    (t: Doc<'templates'>) => {
      o.setPreviewTemplate(t);
      o.setShowCustomizeModal(true);
      o.setShowFullsizePreview(false);
    },
    [o.setPreviewTemplate, o.setShowCustomizeModal, o.setShowFullsizePreview]
  );

  const showAlreadyImported = useCallback(() => {
    o.setToastTemplateData(null);
    o.setShowToast(true);
    o.setToastMessage('You\'ve already added this habit');
  }, [o.setShowToast, o.setToastMessage, o.setToastTemplateData]);

  const handleDirectImport = useCallback(
    async (id: Id<'templates'>) => {
      if (guardImport()) return;
      try {
        o.setImportingTemplateId(id);
        const res = await o.importTemplate({ templateId: id });
        if (res.alreadyExists) {
          o.setImportedTemplateIds((p) => new Set(p).add(id));
          showAlreadyImported();
          return;
        }
        if (res.success) {
          o.setImportedTemplateIds((p) => new Set(p).add(id));
          showSuccess();
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(
            () => o.setShowFullsizePreview(false),
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
      o.importTemplate,
      o.setImportedTemplateIds,
      o.setImportingTemplateId,
      o.setShowFullsizePreview,
      guardImport,
      showAlreadyImported,
      showSuccess,
      showError,
    ]
  );

  const handleTemplateImport = useCallback(
    async (id: Id<'templates'>, c?: TemplateCustomizations) => {
      if (guardImport()) return;
      try {
        o.setImportingTemplateId(id);
        const args = { ...(c ? { customizations: c } : {}), templateId: id };
        const res = await o.importTemplate(args);
        if (res.alreadyExists) {
          o.setImportedTemplateIds((p) => new Set(p).add(id));
          showAlreadyImported();
          o.setShowCustomizeModal(false);
          return;
        }
        if (res.success) {
          o.setImportedTemplateIds((p) => new Set(p).add(id));
          showSuccess();
          o.setShowCustomizeModal(false);
        }
      } catch {
        showError();
      } finally {
        o.setImportingTemplateId(null);
      }
    },
    [
      o.importTemplate,
      o.setImportedTemplateIds,
      o.setImportingTemplateId,
      o.setShowCustomizeModal,
      guardImport,
      showAlreadyImported,
      showSuccess,
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
