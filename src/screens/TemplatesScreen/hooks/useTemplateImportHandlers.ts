/**
 * Handlers for template preview and import operations
 */

import { useCallback, useEffect, useRef } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';
import { FREE_HABIT_LIMIT } from '../../../constants';

export function useTemplateImportHandlers(o: UseTemplateImportHandlersOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewRef = useRef(o.previewTemplate);
  previewRef.current = o.previewTemplate;
  const habitCountRef = useRef(o.userHabitCount);
  habitCountRef.current = o.userHabitCount;

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const showSuccess = useCallback(() => {
    const t = previewRef.current;
    const data = t
      ? { color: t.iconColor ?? '#22c55e', icon: t.icon ?? '✓', name: t.name }
      : null;
    o.setToastTemplateData(data);
    if (habitCountRef.current === 0) {
      o.setShowCelebration(true);
    } else {
      o.setShowToast(true);
    }
    o.setToastMessage('Imported habit successfully');
  }, [
    o.setShowCelebration,
    o.setShowToast,
    o.setToastMessage,
    o.setToastTemplateData,
  ]);

  const showError = useCallback(() => {
    o.setToastTemplateData(null);
    o.setShowToast(true);
    o.setToastMessage('Failed to import template. Please try again.');
  }, [o.setShowToast, o.setToastMessage, o.setToastTemplateData]);

  const guardTemplateImport = useCallback(() => {
    if (!o.isPremiumUser && o.userHabitCount >= FREE_HABIT_LIMIT) {
      o.onShowPaywall?.();
      return true;
    }
    return false;
  }, [o.isPremiumUser, o.userHabitCount, o.onShowPaywall]);

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
      if (guardTemplateImport()) return;
      try {
        o.setImportingTemplateId(id);
        const res = await o.importTemplate({ templateId: id });
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
      guardTemplateImport,
      showSuccess,
      showError,
    ]
  );

  const handleTemplateImport = useCallback(
    async (id: Id<'templates'>, c?: TemplateCustomizations) => {
      if (guardTemplateImport()) return;
      try {
        o.setImportingTemplateId(id);
        const args = { ...(c ? { customizations: c } : {}), templateId: id };
        const res = await o.importTemplate(args);
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
      guardTemplateImport,
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
