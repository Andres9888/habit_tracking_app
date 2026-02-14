/**
 * Event handlers for FullsizeTemplatePreview
 */

import { triggerHaptic } from '@/utils/haptics';
import { useCallback } from 'react';
import { Linking } from 'react-native';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';

interface UseHandlersProps {
  template: Doc<'templates'> | null;
  isImporting: boolean;
  isImported: boolean;
  reducedMotion: boolean;
  onClose: () => void;
  onImport: (templateId: Id<'templates'>) => void;
  onCustomize: (template: Doc<'templates'>) => void;
}

export const useHandlers = ({
  template,
  isImporting,
  isImported,
  reducedMotion,
  onClose,
  onImport,
  onCustomize,
}: UseHandlersProps) => {
  const handleClose = useCallback(() => {
    if (!reducedMotion) {
      triggerHaptic('tap');
    }
    onClose();
  }, [onClose, reducedMotion]);

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

  const handleResearchPress = useCallback(async () => {
    if (!template?.scientificLink) return;
    if (!reducedMotion) {
      triggerHaptic('tap');
    }
    const canOpen = await Linking.canOpenURL(template.scientificLink);
    if (canOpen) {
      await Linking.openURL(template.scientificLink);
    }
  }, [template?.scientificLink, reducedMotion]);

  return {
    handleClose,
    handleCustomize,
    handleImport,
    handleResearchPress,
  };
};
