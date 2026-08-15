import { useCallback, type MutableRefObject } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import { trackLibraryEvent } from '../utils/libraryAnalytics';
import type { ImportOutcome } from './useImportResultHandler';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';

interface UseTemplateImportActionOptions {
  guardImport: () => boolean;
  /** Shared with handleDirectImport — one import at a time across both paths. */
  inFlightRef: MutableRefObject<boolean>;
  handleImportResult: (
    res: Awaited<
      ReturnType<UseTemplateImportHandlersOptions['importTemplate']>
    >,
    id: Id<'templates'>
  ) => ImportOutcome;
  importTemplate: UseTemplateImportHandlersOptions['importTemplate'];
  recordImportedHabit: (
    templateId: Id<'templates'>,
    habitId: Id<'habits'> | undefined
  ) => void;
  setImportingTemplateId: UseTemplateImportHandlersOptions['setImportingTemplateId'];
  setShowCustomizeModal: UseTemplateImportHandlersOptions['setShowCustomizeModal'];
  showError: (retry: () => void) => void;
  templateImportRef: MutableRefObject<
    (
      id: Id<'templates'>,
      c?: TemplateCustomizations
    ) => Promise<ImportOutcome | undefined>
  >;
}

export function useTemplateImportAction(o: UseTemplateImportActionOptions) {
  return useCallback(
    async (id: Id<'templates'>, c?: TemplateCustomizations) => {
      if (o.inFlightRef.current) return;
      if (o.guardImport()) {
        o.setShowCustomizeModal(false);
        return;
      }
      o.inFlightRef.current = true;
      try {
        o.setImportingTemplateId(id);
        const args = { ...(c ? { customizations: c } : {}), templateId: id };
        const res = await o.importTemplate(args);
        const outcome = o.handleImportResult(res, id);
        if (outcome !== 'failed') {
          o.recordImportedHabit(id, res.habitId);
          if (outcome === 'added') {
            trackLibraryEvent({
              type: 'template_added',
              templateId: id,
              // This path is only reached from the customize sheet; the
              // preview's direct Add goes through handleDetailsDirectImport.
              source: 'customize',
            });
          }
          o.setShowCustomizeModal(false);
        }
        return outcome;
      } catch {
        o.setShowCustomizeModal(false);
        o.showError(() => void o.templateImportRef.current(id, c));
      } finally {
        o.inFlightRef.current = false;
        o.setImportingTemplateId(null);
      }
    },
    [
      o.guardImport,
      o.inFlightRef,
      o.handleImportResult,
      o.importTemplate,
      o.recordImportedHabit,
      o.setImportingTemplateId,
      o.setShowCustomizeModal,
      o.showError,
      o.templateImportRef,
    ]
  );
}
