/**
 * Streak Milestone Celebration Notifications
 *
 * Fires a celebratory notification when a user hits key streak milestones
 * (7, 14, 30, 60, 100 days). Triggered imperatively after habit completion,
 * not on a schedule — so quiet hours are checked at call time.
 *
 * Built by Opus.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { ANDROID_CHANNEL_ID } from './constants';
import { ensureNotificationPermissions } from './permissions';
import { isWithinQuietHours } from './quietHours';

const MILESTONE_PREFIX = 'milestone-';

/** Milestones we celebrate */
export const STREAK_MILESTONES = [7, 14, 30, 60, 100, 200, 365] as const;

export type StreakMilestone = (typeof STREAK_MILESTONES)[number];

interface MilestoneMessage {
  title: string;
  body: string;
}

function getMilestoneMessage(
  habitName: string,
  habitEmoji: string,
  streak: number
): MilestoneMessage {
  switch (streak) {
    case 7:
      return {
        title: '🎉 One week strong!',
        body: `${habitEmoji} ${habitName} — 7 days in a row! You're building real momentum.`,
      };
    case 14:
      return {
        title: '⚡ Two weeks!',
        body: `${habitEmoji} ${habitName} — 14-day streak! This is becoming part of who you are.`,
      };
    case 30:
      return {
        title: '🏆 One month!',
        body: `${habitEmoji} ${habitName} — 30 days! They say it takes 30 days to form a habit. You did it!`,
      };
    case 60:
      return {
        title: '💎 60-day legend!',
        body: `${habitEmoji} ${habitName} — 60 days! You're in the top tier of habit builders.`,
      };
    case 100:
      return {
        title: '💯 ONE HUNDRED DAYS!',
        body: `${habitEmoji} ${habitName} — 100-day streak! This is extraordinary dedication.`,
      };
    case 200:
      return {
        title: '🌟 200 days!',
        body: `${habitEmoji} ${habitName} — 200 days! This habit is truly part of your identity now.`,
      };
    case 365:
      return {
        title: '👑 ONE FULL YEAR!',
        body: `${habitEmoji} ${habitName} — 365 days! You've achieved what most people only dream about.`,
      };
    default:
      return {
        title: `🔥 ${streak}-day streak!`,
        body: `${habitEmoji} ${habitName} — Amazing consistency!`,
      };
  }
}

/**
 * Check if a streak count is a milestone worth celebrating.
 */
export function isMilestone(streak: number): boolean {
  return (STREAK_MILESTONES as readonly number[]).includes(streak);
}

export interface StreakMilestoneParams {
  habitId: string;
  habitName: string;
  habitEmoji?: string;
  currentStreak: number;
}

/**
 * Fire a milestone celebration notification immediately (within 2 seconds).
 * Only fires if the streak matches a milestone value.
 * Returns false if the streak isn't a milestone or if in quiet hours.
 */
export async function fireStreakMilestoneNotification({
  habitId,
  habitName,
  habitEmoji = '🔥',
  currentStreak,
}: StreakMilestoneParams): Promise<boolean> {
  if (!isMilestone(currentStreak)) return false;

  const now = new Date();
  if (isWithinQuietHours(now.getHours(), now.getMinutes())) {
    return false; // Don't celebrate during quiet hours
  }

  try {
    const hasPermission = await ensureNotificationPermissions();
    if (!hasPermission) return false;

    const message = getMilestoneMessage(habitName, habitEmoji, currentStreak);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        data: {
          habitId,
          type: 'streakMilestone',
          milestone: currentStreak,
        },
        sound: 'default',
      },
      identifier: `${MILESTONE_PREFIX}${habitId}-${currentStreak}`,
      trigger: {
        ...(Platform.OS === 'android'
          ? { channelId: ANDROID_CHANNEL_ID }
          : {}),
        seconds: 2,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });

    return true;
  } catch (error) {
    if (__DEV__) console.warn('fireStreakMilestoneNotification failed', error);
    return false;
  }
}
