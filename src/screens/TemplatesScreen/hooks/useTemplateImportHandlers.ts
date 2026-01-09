/**
 * Handlers for template preview and import operations
 */

import { useCallback } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';

type ImportFn = (args: {
  templateId: Id<'templates'>;
  customizations?: TemplateCustomizations;
}) => Promise<{ success: boolean }>;

interface UseTemplateImportHandlersOptions {
  importTemplate: ImportFn;
  setImportedTemplateIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setImportingTemplateId: React.Dispatch<
    React.SetStateAction<Id<'templates'> | null>
  >;
  setPreviewTemplate: React.Dispatch<
    React.SetStateAction<Doc<'templates'> | null>
  >;
  setShowCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFullsizePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
}

export function useTemplateImportHandlers(o: UseTemplateImportHandlersOptions) {
  const showSuccess = () => {
    o.setShowToast(true);
    o.setToastMessage('Imported habit successfully');
  };
  const showError = () => {
    o.setShowToast(true);
    o.setToastMessage('Failed to import template. Please try again.');
  };

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
    ]
  );

  return {
    handleCustomizeFromPreview,
    handleDirectImport,
    handleTemplateImport,
    handleTemplatePreview,
  };
}
