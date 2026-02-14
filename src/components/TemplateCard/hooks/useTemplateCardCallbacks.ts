/**
 * useTemplateCardCallbacks Hook
 *
 * Card press and import { triggerHaptic } from '@/utils/haptics';
import callback handlers
 */

import { useCallback } from 'react';
import type { GestureResponderEvent } from 'react-native';

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
      triggerHaptic('tap');
      onPreview();
    }
  }, [onPreview]);

  const handleImportPress = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation();
      triggerHaptic('toggle');
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
