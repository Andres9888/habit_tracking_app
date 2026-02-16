/* eslint-disable max-lines */
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
import {
  fireStreakMilestoneNotification,
} from '../../utils/notifications/streakMilestones';
import {
  getSmartTime,
  recordHabitCompletion,
} from '../../utils/notifications/smartTiming';
import {
  clampToQuietHours,
} from '../../utils/notifications/quietHours';
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
    if (!enabled) {
      await cancelAllStreakAtRiskNotifications();
      return;
    }
    const globalTime = parseTime(reminderTime);

    for (const habit of habits) {
      if (habit.completedToday) {
        // Habit completed — cancel reminders, record timing, check milestones
        await cancelStreakAtRiskNotification(habit.habitId);
        if (isPremium) {
          await cancelStreakFreezeNotification(habit.habitId);
        }
        // Record completion time for smart timing
        await recordHabitCompletion(habit.habitId);
        // Fire milestone celebration if applicable
        await fireStreakMilestoneNotification({
          habitId: habit.habitId,
          habitName: habit.habitName,
          habitEmoji: habit.habitEmoji,
          currentStreak: habit.currentStreak,
        });
        continue;
      }

      if (habit.currentStreak === 0) {
        await cancelStreakAtRiskNotification(habit.habitId);
        if (isPremium) await cancelStreakFreezeNotification(habit.habitId);
        continue;
      }

      // Check if this habit has notifications turned off
      if (habit.notificationMode === 'off') {
        await cancelStreakAtRiskNotification(habit.habitId);
        if (isPremium) {
          await cancelStreakFreezeNotification(habit.habitId);
        }
        continue;
      }

      // Determine reminder time:
      // 1. Smart timing (premium, mode='smart') — learned from completion history
      // 2. Per-habit custom time (premium, mode='fixed' + customReminderTime)
      // 3. Global time (free users)
      let time = globalTime;

      if (isPremium && habit.notificationMode === 'smart') {
        const smartTime = await getSmartTime(habit.habitId);
        if (smartTime) {
          time = smartTime;
        }
      } else if (isPremium && habit.customReminderTime) {
        time = parseTime(habit.customReminderTime);
      }

      // Clamp to quiet hours
      time = clampToQuietHours(time.hour, time.minute);

      await scheduleStreakAtRiskNotification({
        currentStreak: habit.currentStreak,
        habitEmoji: habit.habitEmoji,
        habitId: habit.habitId,
        habitName: habit.habitName,
        hour: time.hour,
        minute: time.minute,
      });
      if (isPremium && habit.currentStreak >= 3) {
        const freezeTime = clampToQuietHours((time.hour + 1) % 24, time.minute);
        await scheduleStreakFreezeNotification({
          currentStreak: habit.currentStreak,
          habitEmoji: habit.habitEmoji || '🔥',
          habitId: habit.habitId,
          habitName: habit.habitName,
          hour: freezeTime.hour,
          minute: freezeTime.minute,
        });
      }
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
