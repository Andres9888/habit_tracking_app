/**
 * Helper functions for useImagePicker hook
 * Permission alerts and settings navigation
 */

import { Alert, Linking, Platform } from 'react-native';

import type { ImageSource } from './types';

/**
 * Opens the device settings app for permission management
 */
export function openSettings(): void {
  if (Platform.OS === 'ios') {
    void Linking.openURL('app-settings:');
  } else {
    void Linking.openSettings();
  }
}

/**
 * Shows an alert when permission is denied
 */
export function showPermissionDeniedAlert(source: ImageSource): void {
  const sourceText = source === 'camera' ? 'camera' : 'photo library';
  Alert.alert(
    'Permission Required',
    `To add images to your Vision Board, please allow access to your ${sourceText} in Settings.`,
    [
      { style: 'cancel', text: 'Cancel' },
      { onPress: openSettings, text: 'Open Settings' },
    ]
  );
}
