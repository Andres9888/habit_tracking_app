/**
 * Shared feedback overlays: Make-It-Stick sheet (first import), toast,
 * and error toast.
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { MakeItStickSheet } from '../../../components/MakeItStickSheet';
import { TemplateAddedToast } from '../../../components/TemplateAddedToast';
import type { TemplateToastData } from '../../../components/TemplateAddedToast';
import Toast from '../../../components/Toast';

interface FeedbackOverlaysProps {
  feedbackHabitId?: Id<'habits'> | null;
  feedbackTemplate?: Doc<'templates'> | null;
  feedbackVariant: 'success' | 'already_exists' | null;
  sessionImportCount: number;
  showCelebration: boolean;
  showToast: boolean;
  toastMessage: string;
  toastOnAction?: (() => void) | null;
  toastTemplateData: TemplateToastData | null;
  onAddAnother: () => void;
  onDismissCelebration: () => void;
  onDismissToast: () => void;
  onSaveError?: () => void;
  onViewHabit: () => void;
}

export function FeedbackOverlays(p: FeedbackOverlaysProps) {
  return (
    <>
      <MakeItStickSheet
        habitId={p.feedbackHabitId ?? null}
        template={p.feedbackTemplate ?? null}
        visible={p.showCelebration}
        onDone={p.onDismissCelebration}
        onSaveError={p.onSaveError}
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
          actionLabel='Retry'
          duration={5000}
          message={p.toastMessage ?? ''}
          variant='error'
          visible={p.showToast}
          onAction={p.toastOnAction ?? undefined}
          onDismiss={p.onDismissToast}
        />
      )}
    </>
  );
}
