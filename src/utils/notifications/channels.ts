import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  ANDROID_AFFIRMATION_CHANNEL_ID,
  ANDROID_CHANNEL_ID,
  ANDROID_LETTER_CHANNEL_ID,
} from './constants';

/**
 * Configure Android notification channel for habit reminders
 */
export async function configureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: '#3B82F6',
    name: 'Habit Reminders',
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });
}

/**
 * Configure Android notification channel for letter unlocks
 * Uses violet color to match the Letters to Self UI theme
 */
export async function configureLetterUnlockChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(ANDROID_LETTER_CHANNEL_ID, {
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: '#8b5cf6', // Violet-500 to match Letters theme
    name: 'Letter Unlocks',
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });
}

/**
 * Configure Android notification channel for affirmation delivery
 * Uses amber color to match the Affirmations UI theme
 */
export async function configureAffirmationChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    ANDROID_AFFIRMATION_CHANNEL_ID,
    {
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#f59e0b', // Amber-500 to match Affirmations theme
      name: 'Daily Affirmations',
      sound: 'default',
      vibrationPattern: [0, 200, 100, 200],
    }
  );
}
