/* eslint-disable max-lines */
/**
 * useStreakReminders — Smart scheduling of streak-at-risk notifications.
 *
 * After each habit completion toggle, recalculates which habits still need
 * reminders today. Cancels notifications for completed habits.
 *
 * Free users: single global reminder time for all habits.
 * Premium users: custom reminder times per habit + streak freeze notifications.
 */

import { useCallback, useEffect, useRef } from 'react';

import type { StreakReminderHabit } from './types';
import {
  scheduleStreakAtRiskNotification,
  cancelStreakAtRiskNotification,
  cancelAllStreakAtRiskNotifications,
} from '../../utils/notifications/streakAtRisk';
import {
  scheduleStreakFreezeNotification,
  cancelStreakFreezeNotification,
} from '../../utils/notifications/streakFreeze';

interface UseStreakRemindersParams {
  /** All habits with their current streak and completion status */
  habits: StreakReminderHabit[];
  /** Whether streak reminders are enabled in settings */
  enabled: boolean;
  /** Global reminder time in "HH:mm" format (default "20:00") */
  reminderTime: string;
  /** Whether the user has premium */
  isPremium: boolean;
}

function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map(Number);
  return { hour: h || 20, minute: m || 0 };
}

function getMessageForStreak(
  habitName: string,
  streak: number,
  emoji: string
): { title: string; body: string } {
  if (streak >= 14) {
    return {
      body: `${emoji} Don't break your ${streak}-day streak on ${habitName}! Tap to complete.`,
      title: `🔥 Streak at risk!`,
    };
  }
  if (streak >= 7) {
    return {
      body: `⚡ You're on a roll! ${habitName} streak: ${streak} days. Keep it going!`,
      title: `${emoji} ${habitName}`,
    };
  }
  if (streak >= 3) {
    return {
      body: `${emoji} ${streak}-day streak on ${habitName} — don't stop now!`,
      title: `Keep going!`,
    };
  }
  return {
    body: `Time to build momentum! Complete ${habitName} today.`,
    title: `${emoji} ${habitName}`,
  };
}

export function useStreakReminders({
  habits,
  enabled,
  reminderTime,
  isPremium,
}: UseStreakRemindersParams) {
  const prevHabitsRef = useRef<string>('');

  const rescheduleAll = useCallback(async () => {
    if (!enabled) {
      await cancelAllStreakAtRiskNotifications();
      return;
    }

    const globalTime = parseTime(reminderTime);

    for (const habit of habits) {
      if (habit.completedToday || habit.currentStreak === 0) {
        // Cancel notification — habit is done or no streak to protect
        await cancelStreakAtRiskNotification(habit.habitId);
        if (isPremium) {
          await cancelStreakFreezeNotification(habit.habitId);
        }
        continue;
      }

      // Determine reminder time (premium: per-habit custom, free: global)
      const time =
        isPremium && habit.customReminderTime
          ? parseTime(habit.customReminderTime)
          : globalTime;

      await scheduleStreakAtRiskNotification({
        currentStreak: habit.currentStreak,
        habitEmoji: habit.habitEmoji,
        habitId: habit.habitId,
        habitName: habit.habitName,
        hour: time.hour,
        minute: time.minute,
      });

      // Premium: schedule streak freeze notification 1 hour after reminder
      if (isPremium && habit.currentStreak >= 3) {
        const freezeHour = (time.hour + 1) % 24;
        await scheduleStreakFreezeNotification({
          currentStreak: habit.currentStreak,
          habitEmoji: habit.habitEmoji || '🔥',
          habitId: habit.habitId,
          habitName: habit.habitName,
          hour: freezeHour,
          minute: time.minute,
        });
      }
    }
  }, [habits, enabled, reminderTime, isPremium]);

  // Reschedule whenever habits completion status changes
  useEffect(() => {
    const key = habits
      .map((h) => `${h.habitId}:${h.completedToday}:${h.currentStreak}`)
      .join('|');

    if (key !== prevHabitsRef.current) {
      prevHabitsRef.current = key;
      void rescheduleAll();
    }
  }, [habits, rescheduleAll]);

  // Also reschedule when settings change
  useEffect(() => {
    void rescheduleAll();
  }, [enabled, reminderTime, rescheduleAll]);

  return { rescheduleAll };
}
