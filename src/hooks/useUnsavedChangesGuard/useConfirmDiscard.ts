/**
 * Confirmation Dialog Hook
 *
 * Core logic for showing the discard confirmation dialog.
 */

import { useCallback } from 'react';
import { Alert, type AlertButton } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';

interface UseConfirmDiscardOptions {
  hasUnsavedChanges: boolean;
  alertTitle: string;
  alertMessage: string;
  discardButtonLabel: string;
  keepEditingButtonLabel: string;
  onDiscard?: () => void;
  setIsConfirmationVisible: (visible: boolean) => void;
}

/**
 * Create confirmation dialog handlers
 */
export function useConfirmDiscard({
  hasUnsavedChanges,
  alertTitle,
  alertMessage,
  discardButtonLabel,
  keepEditingButtonLabel,
  onDiscard,
  setIsConfirmationVisible,
}: UseConfirmDiscardOptions) {
  const confirmDiscard = useCallback(
    (onConfirm: () => void) => {
      if (!hasUnsavedChanges) {
        onConfirm();
        return;
      }

      triggerHaptic('heavy');
      setIsConfirmationVisible(true);

      const buttons: AlertButton[] = [
        {
          onPress: () => setIsConfirmationVisible(false),
          style: 'cancel',
          text: keepEditingButtonLabel,
        },
        {
          onPress: () => {
            setIsConfirmationVisible(false);
            triggerHaptic('tap');
            onDiscard?.();
            onConfirm();
          },
          style: 'destructive',
          text: discardButtonLabel,
        },
      ];

      Alert.alert(alertTitle, alertMessage, buttons, { cancelable: true });
    },
    [
      hasUnsavedChanges,
      alertTitle,
      alertMessage,
      discardButtonLabel,
      keepEditingButtonLabel,
      onDiscard,
      setIsConfirmationVisible,
    ]
  );

  return confirmDiscard;
}
