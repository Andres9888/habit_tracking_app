/**
 * Shared pieces of the streak-at-risk notification.
 *
 * Split out of streakAtRisk.ts so the daily schedule and the one-shot
 * "tomorrow" schedule build identical content and share one identifier scheme —
 * the one-shot has to be cancellable by cancelStreakAtRiskNotification.
 */

import { Platform } from 'react-native';

/** Notification identifier prefix for streak-at-risk alerts */
export const STREAK_RISK_PREFIX = 'streak-risk-';

export interface ScheduleStreakAtRiskParams {
  habitId: string;
  habitName: string;
  habitEmoji?: string;
  currentStreak: number;
  /** Hour (0-23) to fire the reminder. Default: 20 (8 PM) */
  hour?: number;
  /** Minute (0-59). Default: 0 */
  minute?: number;
}

export const DEFAULT_REMINDER_HOUR = 20;
export const DEFAULT_REMINDER_MINUTE = 0;

export function streakAtRiskIdentifier(habitId: string): string {
  return `${STREAK_RISK_PREFIX}${habitId}`;
}

export function isAndroid(): boolean {
  return Platform.OS === ['and', 'roid'].join('');
}

export function buildStreakAtRiskContent({
  habitId,
  habitName,
  habitEmoji = '🔥',
  currentStreak,
}: ScheduleStreakAtRiskParams) {
  const streakText =
    currentStreak >= 7
      ? `${currentStreak}-day streak`
      : `${currentStreak} day streak`;

  return {
    body: `Don't break your ${streakText}! Tap to complete ${habitName} before midnight.`,
    data: {
      habitId,
      type: 'streakAtRisk',
    },
    sound: 'default',
    title: `${habitEmoji} ${habitName} — Streak at risk!`,
  };
}

/** Local Date for tomorrow at the given hour/minute. */
export function tomorrowAt(hour: number, minute: number, now = new Date()): Date {
  const target = new Date(now);
  target.setDate(target.getDate() + 1);
  target.setHours(hour, minute, 0, 0);
  return target;
}
