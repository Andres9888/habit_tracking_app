/**
 * Permission utilities for microphone access
 *
 * Story T10.2: Audio recording integration (expo-audio)
 */

import { Platform, Linking, Alert } from 'react-native';

/**
 * Opens the device settings app so user can grant microphone permission
 * Uses platform-specific URL schemes
 */
export function openMicrophoneSettings(): void {
  if (Platform.OS === 'ios') {
    // On iOS, app-settings: opens the app's settings page directly
    Linking.openURL('app-settings:');
  } else {
    // On Native Handset, openSettings() opens the app details page
    Linking.openSettings();
  }
}

/**
 * Shows an alert when microphone permission is denied
 * Provides option to open Settings
 */
export function showMicrophonePermissionAlert(options?: {
  title?: string;
  message?: string;
  onOpenSettings?: () => void;
  onCancel?: () => void;
}): void {
  const {
    title = 'Microphone Access Required',
    message = 'To record voice notes, please allow microphone access in your device Settings.',
    onOpenSettings,
    onCancel,
  } = options || {};

  Alert.alert(title, message, [
    {
      onPress: onCancel,
      style: 'cancel',
      text: 'Cancel',
    },
    {
      onPress: () => {
        openMicrophoneSettings();
        onOpenSettings?.();
      },
      text: 'Open Settings',
    },
  ]);
}
