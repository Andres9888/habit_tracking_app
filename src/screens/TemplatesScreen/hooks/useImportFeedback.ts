/**
 * Feedback helpers for template import operations (toasts, guards)
 */

import { useCallback, useRef } from 'react';
import { colors } from '@/theme/colors';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { UseTemplateImportHandlersOptions } from './useTemplateImportHandlers.types';

type FeedbackOptions = Pick<
  UseTemplateImportHandlersOptions,
  | 'previewTemplate'
  | 'setFeedbackHabitId'
  | 'setFeedbackVariant'
  | 'setSessionImportCount'
  | 'setShowCelebration'
  | 'setShowToast'
  | 'setToastMessage'
  | 'setToastOnAction'
  | 'setToastTemplateData'
  | 'userHabitCount'
>;

export function useImportFeedback(o: FeedbackOptions) {
  const previewRef = useRef(o.previewTemplate);
  previewRef.current = o.previewTemplate;
  const habitCountRef = useRef(o.userHabitCount);
  habitCountRef.current = o.userHabitCount;

  const showPendingImport = useCallback(
    (template: NonNullable<FeedbackOptions['previewTemplate']>) => {
      o.setFeedbackHabitId(null);
      o.setFeedbackVariant('success');
      o.setToastOnAction(null);
      o.setToastTemplateData({
        color: template.iconColor ?? colors.primary[500],
        icon: template.icon ?? '✓',
        name: template.name,
      });
      o.setShowCelebration(false);
      o.setShowToast(true);
    },
    [
      o.setFeedbackHabitId,
      o.setFeedbackVariant,
      o.setShowCelebration,
      o.setShowToast,
      o.setToastOnAction,
      o.setToastTemplateData,
    ]
  );

  const showImportFeedback = useCallback(
    (
      habitId: Id<'habits'>,
      variant: 'success' | 'already_exists',
      templateOverride?: FeedbackOptions['previewTemplate'],
      forceToast = false
    ) => {
      const t = templateOverride ?? previewRef.current;
      const data = t
        ? { color: t.iconColor ?? colors.primary[500], icon: t.icon ?? '✓', name: t.name }
        : null;

      o.setFeedbackHabitId(habitId);
      o.setFeedbackVariant(variant);
      o.setToastOnAction(null);
      o.setToastTemplateData(data);
      if (variant === 'success') {
        o.setSessionImportCount((count) => count + 1);
      }

      if (!forceToast && variant === 'success' && habitCountRef.current === 0) {
        o.setShowCelebration(true);
      } else {
        o.setShowToast(true);
      }

      // "Imported habit successfully" was engineering copy at the highest-intent
      // moment in the flow. Name the habit back to the user instead. Kept free
      // of "starts today" — plenty of templates are weekly, and the toast is
      // not the place to make a scheduling claim the habit may not honour.
      o.setToastMessage(
        variant === 'already_exists'
          ? 'You already added this habit'
          : t?.name
            ? `${t.name} is on your list`
            : 'Added to your list'
      );
    },
    [
      o.setFeedbackHabitId,
      o.setFeedbackVariant,
      o.setSessionImportCount,
      o.setShowCelebration,
      o.setShowToast,
      o.setToastMessage,
      o.setToastOnAction,
      o.setToastTemplateData,
    ]
  );

  const showSuccess = useCallback(
    (habitId: Id<'habits'>, forceToast = false) =>
      showImportFeedback(habitId, 'success', undefined, forceToast),
    [showImportFeedback]
  );

  const showAlreadyImported = useCallback(
    (habitId: Id<'habits'>) => showImportFeedback(habitId, 'already_exists'),
    [showImportFeedback]
  );

  const showError = useCallback(
    (onRetry?: () => void) => {
      o.setFeedbackHabitId(null);
      o.setFeedbackVariant(null);
      o.setToastTemplateData(null);
      o.setToastOnAction(onRetry ? () => onRetry : null);
      o.setShowToast(true);
      o.setToastMessage('Failed to import template. Please try again.');
    },
    [
      o.setFeedbackHabitId,
      o.setFeedbackVariant,
      o.setShowToast,
      o.setToastMessage,
      o.setToastOnAction,
      o.setToastTemplateData,
    ]
  );

  const guardImport = useCallback(() => false, []);

  return {
    guardImport,
    showAlreadyImported,
    showError,
    showPendingImport,
    showSuccess,
  };
}
