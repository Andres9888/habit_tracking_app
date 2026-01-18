import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  ANDROID_AFFIRMATION_CHANNEL_ID,
  NOTIFICATION_TYPE_AFFIRMATION_DELIVERY,
} from '../constants';

import { getNextWeeklyOccurrence } from './weeklyUtils';

export async function scheduleDailyNotification(
  affirmationId: string,
  habitId: string,
  truncatedText: string,
  hours: number,
  minutes: number
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      body: `"${truncatedText}"`,
      data: {
        affirmationId,
        habitId,
        type: NOTIFICATION_TYPE_AFFIRMATION_DELIVERY,
      },
      sound: 'default',
      title: '✨ Daily Affirmation',
    },
    trigger: {
      ...(Platform.OS === 'android'
        ? { channelId: ANDROID_AFFIRMATION_CHANNEL_ID }
        : {}),
      hour: hours,
      minute: minutes,
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
    },
  });
}

export async function scheduleWeeklyNotification(
  affirmationId: string,
  habitId: string,
  truncatedText: string,
  hours: number,
  minutes: number,
  daysOfWeek: number[]
): Promise<string> {
  const nextDate = getNextWeeklyOccurrence(hours, minutes, daysOfWeek);

  return Notifications.scheduleNotificationAsync({
    content: {
      body: `"${truncatedText}"`,
      data: {
        affirmationId,
        daysOfWeek,
        frequency: 'weekly',
        habitId,
        type: NOTIFICATION_TYPE_AFFIRMATION_DELIVERY,
      },
      sound: 'default',
      title: '✨ Weekly Affirmation',
    },
    trigger: {
      ...(Platform.OS === 'android'
        ? { channelId: ANDROID_AFFIRMATION_CHANNEL_ID }
        : {}),
      date: nextDate,
      type: Notifications.SchedulableTriggerInputTypes.DATE,
    },
  });
}
