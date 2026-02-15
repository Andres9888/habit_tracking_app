/**
 * Event handlers for FullsizeTemplatePreview
 */

import { Linking } from 'react-native';
import { useCallback } from 'react';

import * as Haptics from 'expo-haptics';

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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  }, [onClose, reducedMotion]);

  const handleImport = useCallback(() => {
    if (!template || isImporting || isImported) return;
    if (!reducedMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onImport(template._id);
  }, [template, isImporting, isImported, onImport, reducedMotion]);

  const handleCustomize = useCallback(() => {
    if (!template) return;
    if (!reducedMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onCustomize(template);
  }, [template, onCustomize, reducedMotion]);

  const handleResearchPress = useCallback(async () => {
    if (!template?.scientificLink) return;
    if (!reducedMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
