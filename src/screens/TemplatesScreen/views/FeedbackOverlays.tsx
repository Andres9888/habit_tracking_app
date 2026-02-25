/**
 * Shared feedback overlays: celebration, toast, and error toast.
 * Used by both BrowseView and CategorySearchView.
 */

import {
  CelebrationOverlay,
  TemplateAddedToast,
} from '../../../components/TemplateAddedToast';
import type { TemplateToastData } from '../../../components/TemplateAddedToast';
import Toast from '../../../components/Toast';

interface FeedbackOverlaysProps {
  showCelebration: boolean;
  showToast: boolean;
  toastMessage: string;
  toastTemplateData: TemplateToastData | null;
  onDismissCelebration: () => void;
  onDismissToast: () => void;
}

export function FeedbackOverlays(p: FeedbackOverlaysProps) {
  return (
    <>
      <CelebrationOverlay
        templateData={p.toastTemplateData}
        visible={p.showCelebration}
        onAddAnother={p.onDismissCelebration}
        onGoToHabits={p.onDismissCelebration}
      />
      {p.toastTemplateData ? (
        <TemplateAddedToast
          templateData={p.toastTemplateData}
          visible={p.showToast}
          onDismiss={p.onDismissToast}
        />
      ) : (
        <Toast
          duration={3000}
          message={p.toastMessage ?? ''}
          variant='error'
          visible={p.showToast}
          onDismiss={p.onDismissToast}
        />
      )}
    </>
  );
}
