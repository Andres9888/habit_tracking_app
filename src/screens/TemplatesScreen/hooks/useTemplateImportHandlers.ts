/**
 * Handlers for template preview and import operations
 */

import { useCallback } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';

export function useTemplateImportHandlers(o: UseTemplateImportHandlersOptions) {
  const showSuccess = useCallback(() => {
    o.setShowToast(true);
    o.setToastMessage('Imported habit successfully');
  }, [o.setShowToast, o.setToastMessage]);

  const showError = useCallback(() => {
    o.setShowToast(true);
    o.setToastMessage('Failed to import template. Please try again.');
  }, [o.setShowToast, o.setToastMessage]);

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

  const handleDirectImport = useCallback(
    async (id: Id<'templates'>) => {
      try {
        o.setImportingTemplateId(id);
        const res = await o.importTemplate({
          customizations: undefined,
          templateId: id,
        });
        if (res.success) {
          o.setImportedTemplateIds((p) => new Set(p).add(id));
          showSuccess();
          setTimeout(() => o.setShowFullsizePreview(false), 1000);
        }
      } catch (error) {
        console.error('Failed to import:', error);
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
      showSuccess,
      showError,
    ]
  );

  const handleTemplateImport = useCallback(
    async (id: Id<'templates'>, c?: TemplateCustomizations) => {
      try {
        o.setImportingTemplateId(id);
        const res = await o.importTemplate({
          customizations: c,
          templateId: id,
        });
        if (res.success) {
          o.setImportedTemplateIds((p) => new Set(p).add(id));
          showSuccess();
          o.setShowCustomizeModal(false);
        }
      } catch (error) {
        console.error('Failed to import:', error);
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
