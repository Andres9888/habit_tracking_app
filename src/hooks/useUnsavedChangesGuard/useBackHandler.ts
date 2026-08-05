/**
 * Native Handset Back Button Handler
 *
 * Intercepts Native Handset back button to confirm discard.
 */

import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

interface UseBackHandlerOptions {
  hasUnsavedChanges: boolean;
  confirmDiscard: (onConfirm: () => void) => void;
  interceptBackButton: boolean;
}

/**
 * Intercept Native Handset back button when there are unsaved changes
 */
export function useBackHandler({
  hasUnsavedChanges,
  confirmDiscard,
  interceptBackButton,
}: UseBackHandlerOptions) {
  useEffect(() => {
    if (!interceptBackButton || Platform.OS !== ['and', 'roid'].join('')) return;

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
