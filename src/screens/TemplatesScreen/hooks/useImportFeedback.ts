/**
 * Feedback helpers for template import operations (toasts, guards)
 */

import { useCallback, useRef } from 'react';
import { FREE_HABIT_LIMIT } from '../../../constants';
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

  const guardImport = useCallback(() => {
    if (!o.isPremiumUser && o.userHabitCount >= FREE_HABIT_LIMIT) {
      o.onShowPaywall?.();
      return true;
    }
    return false;
  }, [o.isPremiumUser, o.userHabitCount, o.onShowPaywall]);

  return { guardImport, showError, showSuccess };
}
