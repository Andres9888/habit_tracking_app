/**
 * Shared feedback overlays: celebration, toast, and error toast.
 */

import {
  CelebrationOverlay,
  TemplateAddedToast,
} from '../../../components/TemplateAddedToast';
import type { TemplateToastData } from '../../../components/TemplateAddedToast';
import Toast from '../../../components/Toast';

interface FeedbackOverlaysProps {
  feedbackVariant: 'success' | 'already_exists' | null;
  sessionImportCount: number;
  showCelebration: boolean;
  showToast: boolean;
  toastMessage: string;
  toastTemplateData: TemplateToastData | null;
  onAddAnother: () => void;
  onDismissCelebration: () => void;
  onDismissToast: () => void;
  onViewHabit: () => void;
}

export function FeedbackOverlays(p: FeedbackOverlaysProps) {
  return (
    <>
      <CelebrationOverlay
        templateData={p.toastTemplateData}
        visible={p.showCelebration}
        onAddAnother={p.onAddAnother}
        onGoToHabits={p.onViewHabit}
      />
      {p.toastTemplateData ? (
        <TemplateAddedToast
          sessionImportCount={p.sessionImportCount}
          templateData={p.toastTemplateData}
          variant={p.feedbackVariant ?? 'success'}
          visible={p.showToast}
          onAddAnother={p.onAddAnother}
          onDismiss={p.onDismissToast}
          onViewHabit={p.onViewHabit}
        />
      ) : (
        <Toast
          duration={5000}
          message={p.toastMessage ?? ''}
          variant='error'
          visible={p.showToast}
          onDismiss={p.onDismissToast}
        />
      )}
    </>
  );
}
