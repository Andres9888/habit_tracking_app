/**
 * useAndroidBackButton Hook
 *
 * Handles Android hardware back button for modals.
 * Automatically closes modal when back button is pressed.
 *
 * Usage:
 * ```tsx
 * useAndroidBackButton(visible, onClose);
 * ```
 */

import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

export function useAndroidBackButton(
  visible: boolean,
  onClose: () => void
): void {
  useEffect(() => {
    if (!visible || Platform.OS !== 'android') return;

    const handleBackPress = () => {
      onClose();
      return true; // Prevent default back behavior
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => subscription.remove();
  }, [visible, onClose]);
}

export default useAndroidBackButton;
