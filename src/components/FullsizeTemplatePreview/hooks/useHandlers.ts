/**
 * Event handlers for FullsizeTemplatePreview.
 *
 * The modal has two semantically distinct exits:
 *   handleBack  → the Habit Library, which stays mounted behind the overlay.
 *   handleClose → the home screen, dismissing the library too.
 *
 * `handleGoToHabit` is the post-add primary action: home, plus a request to
 * scroll to and highlight the new habit. With no habit id (or no handler) it
 * degrades to `handleClose`, i.e. today's plain exit-to-home.
 *
 * `handleDismiss` is what implicit gestures (hardware back, backdrop,
 * swipe) resolve to. It maps to BACK, never home: an implicit dismissal
 * means "undo the thing I just opened", and taking someone out of the
 * library they were browsing is a bigger jump than they asked for. It only
 * falls through to close when no back handler exists, so a caller that
 * renders the preview without a library behind it still has a way out.
 */

import { useCallback } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';

interface UseHandlersProps {
  template: Doc<'templates'> | null;
  importedHabitId?: Id<'habits'> | null;
  onGoToHabit?: (habitId: Id<'habits'>) => void;
  isImporting: boolean;
  isImported: boolean;
  reducedMotion: boolean;
  onClose: () => void;
  onBack?: () => void;
  onImport: (templateId: Id<'templates'>) => void;
  onCustomize: (template: Doc<'templates'>) => void;
}

export const useHandlers = ({
  template,
  importedHabitId,
  onGoToHabit,
  isImporting,
  isImported,
  reducedMotion,
  onClose,
  onBack,
  onImport,
  onCustomize,
}: UseHandlersProps) => {
  const handleClose = useCallback(() => {
    if (!reducedMotion) {
      triggerHaptic('tap');
    }
    onClose();
  }, [onClose, reducedMotion]);

  const handleBack = useCallback(() => {
    if (!onBack) return;
    if (!reducedMotion) {
      triggerHaptic('tap');
    }
    onBack();
  }, [onBack, reducedMotion]);

  const handleImport = useCallback(() => {
    if (!template || isImporting || isImported) return;
    if (!reducedMotion) {
      triggerHaptic('toggle');
    }
    onImport(template._id);
  }, [template, isImporting, isImported, onImport, reducedMotion]);

  const handleCustomize = useCallback(() => {
    if (!template) return;
    if (!reducedMotion) {
      triggerHaptic('tap');
    }
    onCustomize(template);
  }, [template, onCustomize, reducedMotion]);

  const handleGoToHabit = useCallback(() => {
    if (!reducedMotion) {
      triggerHaptic('tap');
    }
    if (importedHabitId && onGoToHabit) onGoToHabit(importedHabitId);
    else onClose();
  }, [importedHabitId, onClose, onGoToHabit, reducedMotion]);

  const handleDismiss = useCallback(() => {
    if (onBack) {
      handleBack();
      return;
    }
    handleClose();
  }, [handleBack, handleClose, onBack]);

  return {
    handleClose,
    handleBack: onBack ? handleBack : undefined,
    handleDismiss,
    handleGoToHabit,
    handleCustomize,
    handleImport,
  };
};
