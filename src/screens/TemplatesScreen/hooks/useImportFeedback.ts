/**
 * Feedback helpers for template import operations (toasts, guards)
 */

import { useCallback, useRef } from 'react';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';

export function useImportFeedback(o: UseTemplateImportHandlersOptions) {
  const previewRef = useRef(o.previewTemplate);
  previewRef.current = o.previewTemplate;
  const habitCountRef = useRef(o.userHabitCount);
  habitCountRef.current = o.userHabitCount;

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

  // Free habit cap was removed in favour of trial-then-paywall gate at AuthGate.
  // In-app users always have an entitlement, so import is never blocked here.
  const guardImport = useCallback(() => false, []);

  return { guardImport, showError, showSuccess };
}
