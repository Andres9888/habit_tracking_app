/**
 * Async Confirmation Dialog Hook
 *
 * Promise-based confirmation dialog for more flexible control flow.
 */

import { useCallback, type MutableRefObject } from 'react';
import { Alert, type AlertButton } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';

interface UseConfirmDiscardAsyncOptions {
  hasUnsavedChanges: boolean;
  alertTitle: string;
  alertMessage: string;
  discardButtonLabel: string;
  keepEditingButtonLabel: string;
  onDiscard?: () => void;
  setIsConfirmationVisible: (visible: boolean) => void;
  resolveRef: MutableRefObject<((value: boolean) => void) | null>;
}

/**
 * Create async confirmation dialog handler
 */
export function useConfirmDiscardAsync({
  hasUnsavedChanges,
  alertTitle,
  alertMessage,
  discardButtonLabel,
  keepEditingButtonLabel,
  onDiscard,
  setIsConfirmationVisible,
  resolveRef,
}: UseConfirmDiscardAsyncOptions) {
  return useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!hasUnsavedChanges) {
        resolve(true);
        return;
      }

      triggerHaptic('heavy');
      setIsConfirmationVisible(true);
      resolveRef.current = resolve;

      const buttons: AlertButton[] = [
        {
          onPress: () => {
            setIsConfirmationVisible(false);
            resolveRef.current?.(false);
            resolveRef.current = null;
          },
          style: 'cancel',
          text: keepEditingButtonLabel,
        },
        {
          onPress: () => {
            setIsConfirmationVisible(false);
            triggerHaptic('tap');
            onDiscard?.();
            resolveRef.current?.(true);
            resolveRef.current = null;
          },
          style: 'destructive',
          text: discardButtonLabel,
        },
      ];

      Alert.alert(alertTitle, alertMessage, buttons, {
        cancelable: true,
        onDismiss: () => {
          setIsConfirmationVisible(false);
          resolveRef.current?.(false);
          resolveRef.current = null;
        },
      });
    });
  }, [
    hasUnsavedChanges,
    alertTitle,
    alertMessage,
    discardButtonLabel,
    keepEditingButtonLabel,
    onDiscard,
    setIsConfirmationVisible,
    resolveRef,
  ]);
}
