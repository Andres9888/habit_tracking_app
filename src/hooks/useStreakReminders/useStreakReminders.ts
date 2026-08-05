/**
 * useStreakReminders — Smart scheduling of streak-at-risk notifications.
 */

import { useCallback, useEffect, useRef } from 'react';
import {
  scheduleStreakAtRiskNotification,
  cancelStreakAtRiskNotification,
  cancelAllStreakAtRiskNotifications,
} from '../../utils/notifications/streakAtRisk';
import {
  scheduleStreakFreezeNotification,
  cancelStreakFreezeNotification,
} from '../../utils/notifications/streakFreeze';
import type { StreakReminderHabit } from './types';
import { parseTime } from './streakMessageHelpers';

interface UseStreakRemindersParams {
  habits: StreakReminderHabit[];
  enabled: boolean;
  reminderTime: string;
  isPremium: boolean;
}

export function useStreakReminders({
  habits,
  enabled,
  reminderTime,
  isPremium,
}: UseStreakRemindersParams) {
  const prevHabitsRef = useRef<string>('');

  const rescheduleAll = useCallback(async () => {
    try {
      if (!enabled) {
        await cancelAllStreakAtRiskNotifications();
        return;
      }
      const globalTime = parseTime(reminderTime);

      for (const habit of habits) {
        if (habit.completedToday || habit.currentStreak === 0) {
          await cancelStreakAtRiskNotification(habit.habitId);
          if (isPremium) await cancelStreakFreezeNotification(habit.habitId);
          continue;
        }
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
    } catch (error) {
      if (__DEV__) {
        console.error(
          '[useStreakReminders] Failed to reschedule notifications:',
          error
        );
      }
      // Non-critical operation - fail silently to avoid breaking the app
    }
  }, [habits, enabled, reminderTime, isPremium]);

  useEffect(() => {
    const key = habits
      .map((h) => `${h.habitId}:${h.completedToday}:${h.currentStreak}`)
      .join('|');
    if (key !== prevHabitsRef.current) {
      prevHabitsRef.current = key;
      void rescheduleAll();
    }
  }, [habits, rescheduleAll]);

  useEffect(() => {
    void rescheduleAll();
  }, [enabled, reminderTime, rescheduleAll]);

  return { rescheduleAll };
}
