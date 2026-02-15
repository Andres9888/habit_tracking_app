/**
 * Android Back Button Handler
 *
 * Intercepts Android back button to confirm discard.
 */

import { BackHandler, Platform } from 'react-native';
import { useEffect } from 'react';

interface UseBackHandlerOptions {
  hasUnsavedChanges: boolean;
  confirmDiscard: (onConfirm: () => void) => void;
  interceptBackButton: boolean;
}

/**
 * Intercept Android back button when there are unsaved changes
 */
export function useBackHandler({
  hasUnsavedChanges,
  confirmDiscard,
  interceptBackButton,
}: UseBackHandlerOptions) {
  useEffect(() => {
    if (!interceptBackButton || Platform.OS !== 'android') return;

    const handleBackPress = () => {
      if (hasUnsavedChanges) {
        confirmDiscard(() => {});
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );
    return () => subscription.remove();
  }, [hasUnsavedChanges, confirmDiscard, interceptBackButton]);
}
