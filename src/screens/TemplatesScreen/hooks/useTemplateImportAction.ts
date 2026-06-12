import { useCallback, type MutableRefObject } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import { trackLibraryEvent } from '../utils/libraryAnalytics';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';

interface UseTemplateImportActionOptions {
  guardImport: () => boolean;
  handleImportResult: (
    res: Awaited<
      ReturnType<UseTemplateImportHandlersOptions['importTemplate']>
    >,
    id: Id<'templates'>
  ) => boolean;
  importTemplate: UseTemplateImportHandlersOptions['importTemplate'];
  setImportingTemplateId: UseTemplateImportHandlersOptions['setImportingTemplateId'];
  setShowCustomizeModal: UseTemplateImportHandlersOptions['setShowCustomizeModal'];
  showError: (retry: () => void) => void;
  templateImportRef: MutableRefObject<
    (id: Id<'templates'>, c?: TemplateCustomizations) => Promise<void>
  >;
}

export function useTemplateImportAction(o: UseTemplateImportActionOptions) {
  return useCallback(
    async (id: Id<'templates'>, c?: TemplateCustomizations) => {
      if (o.guardImport()) {
        o.setShowCustomizeModal(false);
        return;
      }
      try {
        o.setImportingTemplateId(id);
        const args = { ...(c ? { customizations: c } : {}), templateId: id };
        const res = await o.importTemplate(args);
        if (o.handleImportResult(res, id)) {
          trackLibraryEvent({
            type: 'template_added',
            templateId: id,
            source: 'details',
          });
          o.setShowCustomizeModal(false);
        }
      } catch {
        o.setShowCustomizeModal(false);
        o.showError(() => void o.templateImportRef.current(id, c));
      } finally {
        o.setImportingTemplateId(null);
      }
    },
    [
      o.guardImport,
      o.handleImportResult,
      o.importTemplate,
      o.setImportingTemplateId,
      o.setShowCustomizeModal,
      o.showError,
      o.templateImportRef,
    ]
  );
}
