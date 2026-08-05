/**
 * Event handlers for FullsizeTemplatePreview
 */

import { useCallback } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';

interface UseHandlersProps {
  template: Doc<'templates'> | null;
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

  return {
    handleClose,
    handleBack: onBack ? handleBack : undefined,
    handleCustomize,
    handleImport,
  };
};
