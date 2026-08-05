/**
 * Feedback state cluster for TemplatesScreen: toast, celebration,
 * and per-import feedback identifiers.
 */

import { useCallback, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { TemplateToastData } from '../../../components/TemplateAddedToast';

export function useFeedbackState() {
  const [showToast, setShowToast] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastTemplateData, setToastTemplateData] =
    useState<TemplateToastData | null>(null);
  const [toastOnAction, setToastOnAction] = useState<(() => void) | null>(null);
  const [feedbackHabitId, setFeedbackHabitId] = useState<Id<'habits'> | null>(
    null
  );
  const [feedbackVariant, setFeedbackVariant] = useState<
    'success' | 'already_exists' | null
  >(null);
  const [sessionImportCount, setSessionImportCount] = useState(0);

  // Clearing feedback means clearing all five pieces of it. Exposed as one
  // call so callers can't half-dismiss it (toast gone, variant still set).
  const dismissFeedback = useCallback(() => {
    setShowToast(false);
    setShowCelebration(false);
    setFeedbackHabitId(null);
    setFeedbackVariant(null);
    setToastOnAction(null);
  }, []);

  const showFeedbackError = useCallback((message: string) => {
    setToastTemplateData(null);
    setToastOnAction(null);
    setToastMessage(message);
    setShowToast(true);
  }, []);

  return {
    dismissFeedback,
    showFeedbackError,
    feedbackHabitId,
    feedbackVariant,
    sessionImportCount,
    setFeedbackHabitId,
    setFeedbackVariant,
    setSessionImportCount,
    setShowCelebration,
    setShowToast,
    setToastMessage,
    setToastOnAction,
    setToastTemplateData,
    showCelebration,
    showToast,
    toastMessage,
    toastOnAction,
    toastTemplateData,
  };
}
