/**
 * useStreakReminders — Smart scheduling of streak-at-risk notifications.
 */

import { useCallback, useEffect, useRef } from 'react';
import { cancelAllStreakAtRiskNotifications } from '../../utils/notifications/streakAtRisk';
import type { StreakReminderHabit } from './types';
import { parseTime } from './streakMessageHelpers';
import { scheduleHabitStreakReminder } from './scheduleHabitStreakReminder';

interface UseStreakRemindersParams {
  habits: StreakReminderHabit[];
  enabled: boolean;
  reminderTime: string;
  isPremium: boolean;
}

/** Signature of everything that can change what should be scheduled. */
function habitsKey(habits: StreakReminderHabit[]): string {
  return habits
    .map(
      (h) =>
        `${h.habitId}:${h.completedToday}:${h.currentStreak}:${h.customReminderTime ?? ''}`
    )
    .join('|');
}

export function useStreakReminders({
  habits,
  enabled,
  reminderTime,
  isPremium,
}: UseStreakRemindersParams) {
  const habitsRef = useRef(habits);
  habitsRef.current = habits;

  const rescheduleAll = useCallback(async () => {
    try {
      if (!enabled) {
        await cancelAllStreakAtRiskNotifications();
        return;
      }
      const context = { globalTime: parseTime(reminderTime), isPremium };
      for (const habit of habitsRef.current) {
        await scheduleHabitStreakReminder(habit, context);
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
  }, [enabled, reminderTime, isPremium]);

  // One effect, keyed on the habits signature rather than the array identity.
  // The previous second effect depended on rescheduleAll, whose identity
  // changed with `habits`, so every toggle re-ran it and defeated the dedup —
  // a cancel + reschedule storm across every habit on each tap.
  const rescheduleRef = useRef(rescheduleAll);
  rescheduleRef.current = rescheduleAll;
  const key = habitsKey(habits);

  useEffect(() => {
    void rescheduleRef.current();
  }, [key, enabled, reminderTime, isPremium]);

  return { rescheduleAll };
}
