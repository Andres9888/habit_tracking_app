/**
 * Event handlers hook for TemplateScienceModal
 */

import { triggerHaptic } from '@/utils/haptics';
import { useCallback, useState } from 'react';
import { Linking, Share } from 'react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';

interface UseModalHandlersProps {
  onClose: () => void;
  onUseTemplate: () => void;
  template: Doc<'templates'> | null;
}

export const useModalHandlers = ({
  onClose,
  onUseTemplate,
  template,
}: UseModalHandlersProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClose = useCallback(() => {
    triggerHaptic('tap');
    onClose();
  }, [onClose]);

  const handleLinkPress = useCallback(async () => {
    triggerHaptic('tap');
    if (template?.scientificLink) {
      const canOpen = await Linking.canOpenURL(template.scientificLink);
      if (canOpen) {
        await Linking.openURL(template.scientificLink);
      }
    }
  }, [template?.scientificLink]);

  const handleYoutubePress = useCallback(async () => {
    triggerHaptic('tap');
    if (template?.youtubeLink) {
      const canOpen = await Linking.canOpenURL(template.youtubeLink);
      if (canOpen) {
        await Linking.openURL(template.youtubeLink);
      }
    }
  }, [template?.youtubeLink]);

  const handleShare = useCallback(async () => {
    if (!template) return;
    triggerHaptic('toggle');
    try {
      await Share.share({
        message: `Check out this habit template: "${template.name}"\n\n${template.description}\n\n🔬 Scientific backing: ${template.scientificReference}\n\nBuild this habit with Chain Day: https://apps.apple.com/app/chain-day`,
        title: `${template.name} - Habit Template`,
      });
    } catch (error) {
      if (__DEV__) console.error('Error sharing template:', error);
    }
  }, [template]);

  const handleUseTemplate = useCallback(() => {
    triggerHaptic('success');
    setShowConfetti(true);
    setTimeout(() => {
      onUseTemplate();
    }, 800);
  }, [onUseTemplate]);

  return {
    handleClose,
    handleLinkPress,
    handleShare,
    handleUseTemplate,
    handleYoutubePress,
    showConfetti,
  };
};
