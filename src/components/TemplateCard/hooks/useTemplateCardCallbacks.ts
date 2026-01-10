/**
 * useTemplateCardCallbacks Hook
 *
 * Card press and import callback handlers
 */

import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

interface UseTemplateCardCallbacksProps {
  isLocked: boolean;
  onImport: () => void;
  onPreview?: () => void;
  onUpgrade?: () => void;
}

export function useTemplateCardCallbacks({
  isLocked,
  onImport,
  onPreview,
  onUpgrade,
}: UseTemplateCardCallbacksProps) {
  const handleCardPress = useCallback(() => {
    if (onPreview) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPreview();
    }
  }, [onPreview]);

  const handleImportPress = useCallback(
    (e: any) => {
      e.stopPropagation();
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (isLocked && onUpgrade) {
        onUpgrade();
        return;
      }
      if (!isLocked) onImport();
    },
    [isLocked, onImport, onUpgrade]
  );

  return { handleCardPress, handleImportPress };
}
