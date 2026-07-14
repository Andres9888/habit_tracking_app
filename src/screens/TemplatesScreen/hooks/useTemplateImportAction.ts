import { useCallback, type MutableRefObject } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import { trackLibraryEvent } from '../utils/libraryAnalytics';
import type { ImportResultStatus } from './useImportResultHandler';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';

interface UseTemplateImportActionOptions {
  finishImport: (id: Id<'templates'>) => void;
  guardImport: () => boolean;
  handleImportResult: (
    res: Awaited<
      ReturnType<UseTemplateImportHandlersOptions['importTemplate']>
    >,
    id: Id<'templates'>
  ) => ImportResultStatus;
  importTemplate: UseTemplateImportHandlersOptions['importTemplate'];
  setShowCustomizeModal: UseTemplateImportHandlersOptions['setShowCustomizeModal'];
  showError: (retry: () => void) => void;
  startImport: (id: Id<'templates'>) => boolean;
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
      if (!o.startImport(id)) return;
      try {
        const args = {
          ...(c ? { customizations: c } : {}),
          source: 'details' as const,
          templateId: id,
        };
        const res = await o.importTemplate(args);
        const result = o.handleImportResult(res, id);
        if (result === 'imported') {
          trackLibraryEvent({
            type: 'template_added',
            templateId: id,
            source: 'details',
          });
        }
        if (result !== 'failed') {
          o.setShowCustomizeModal(false);
        }
      } catch {
        o.setShowCustomizeModal(false);
        o.showError(() => void o.templateImportRef.current(id, c));
      } finally {
        o.finishImport(id);
      }
    },
    [
      o.finishImport,
      o.guardImport,
      o.handleImportResult,
      o.importTemplate,
      o.setShowCustomizeModal,
      o.showError,
      o.startImport,
      o.templateImportRef,
    ]
  );
}
