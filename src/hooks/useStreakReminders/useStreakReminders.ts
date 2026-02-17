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
import type { StreakReminderHabit } from './types';
import { parseTime } from './streakMessageHelpers';

interface UseStreakRemindersParams {
  habits: StreakReminderHabit[];
  enabled: boolean;
  reminderTime: string;
  isPremium: boolean;
}

/**
 * ⚠️ Hook >100 lines (125 lines) - Consider refactoring
 *
 * Hook for scheduling streak-at-risk notifications for habits.
 * Automatically manages daily reminders to prevent streak breaks.
 *
 * @description
 * Features:
 * - Schedules notifications for habits with active streaks not yet completed today
 * - Skips habits already completed or with 0 streak
 * - Premium: Supports per-habit custom reminder times
 * - Premium: Schedules streak freeze reminders 1 hour after main reminder (3+ day streaks)
 * - Auto-reschedules when habits list changes
 * - Cancels all when disabled
 *
 * Notification strategy:
 * 1. Check if habit needs reminder (has streak, not completed today)
 * 2. Use custom time if premium + habit has customReminderTime, else global time
 * 3. Schedule "Streak at risk" notification at reminder time
 * 4. If premium + streak ≥ 3: Schedule "Use streak freeze?" notification 1h later
 *
 * @param params - Configuration
 * @param params.habits - Array of habits with streak and completion status
 * @param params.enabled - Whether reminders are globally enabled
 * @param params.reminderTime - Global reminder time (format: "HH:MM")
 * @param params.isPremium - Whether user has premium (enables custom times + freeze)
 * @returns Object with rescheduleAll function
 *
 * @example
 * ```tsx
 * function SettingsScreen() {
 *   const habits = useQuery(api.habits.list);
 *   const settings = useQuery(api.settings.get);
 *   const isPremium = usePremium();
 *
 *   useStreakReminders({
 *     habits: habits?.map(h => ({
 *       habitId: h._id,
 *       habitName: h.name,
 *       habitEmoji: h.icon,
 *       currentStreak: h.currentStreak,
 *       completedToday: h.completedDates.has(today),
 *       customReminderTime: h.customReminderTime
 *     })) || [],
 *     enabled: settings?.streakRemindersEnabled || false,
 *     reminderTime: settings?.streakReminderTime || '19:00',
 *     isPremium: isPremium.isPremium
 *   });
 *
 *   return <SettingsUI />;
 * }
 * ```
 */
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
