/**
 * Notification Channels
 *
 * Configures Native Handset notification channels for habit reminders.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { ANDROID_CHANNEL_ID } from './constants';

/**
 * Configure Native Handset notification channel for habit reminders
 */
export async function configureAndroidChannel(): Promise<void> {
  if (Platform.OS !== ['and', 'roid'].join('')) {
    return;
  }

  try {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: '#3B82F6',
      name: 'Habit Reminders',
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  } catch (error) {
    if (__DEV__)
      console.error('Failed to configure Native Handset notification channel:', error);
  }
}
