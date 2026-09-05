/**
 * Per-habit streak reminder scheduling.
 *
 * Split out of useStreakReminders so the hook stays a thin loop and this
 * decision table is testable on its own.
 */

import {
  scheduleStreakAtRiskForTomorrow,
  scheduleStreakAtRiskNotification,
  cancelStreakAtRiskNotification,
} from '../../utils/notifications/streakAtRisk';
import {
  scheduleStreakFreezeNotification,
  cancelStreakFreezeNotification,
} from '../../utils/notifications/streakFreeze';
import type { StreakReminderHabit } from './types';
import { parseTime } from './streakMessageHelpers';

export interface StreakReminderContext {
  globalTime: { hour: number; minute: number };
  isPremium: boolean;
}

/** Minimum streak before the premium streak-freeze nudge is worth sending. */
const FREEZE_MIN_STREAK = 3;

export async function scheduleHabitStreakReminder(
  habit: StreakReminderHabit,
  { globalTime, isPremium }: StreakReminderContext
): Promise<void> {
  if (habit.currentStreak === 0) {
    await cancelStreakAtRiskNotification(habit.habitId);
    if (isPremium) await cancelStreakFreezeNotification(habit.habitId);
    return;
  }

  const time =
    isPremium && habit.customReminderTime
      ? parseTime(habit.customReminderTime)
      : globalTime;
  const params = {
    currentStreak: habit.currentStreak,
    habitEmoji: habit.habitEmoji,
    habitId: habit.habitId,
    habitName: habit.habitName,
    hour: time.hour,
    minute: time.minute,
  };

  if (habit.completedToday) {
    // Done for today, so there is nothing to nudge about — but cancelling the
    // daily repeat outright used to leave nothing scheduled at all, and the
    // reminder only came back if the app was opened the next day before
    // reminder time. Book tomorrow's slot instead, under the same identifier.
    if (isPremium) await cancelStreakFreezeNotification(habit.habitId);
    await scheduleStreakAtRiskForTomorrow(params);
    return;
  }

  await scheduleStreakAtRiskNotification(params);

  if (isPremium && habit.currentStreak >= FREEZE_MIN_STREAK) {
    await scheduleStreakFreezeNotification({
      ...params,
      habitEmoji: habit.habitEmoji || '🔥',
      hour: (time.hour + 1) % 24,
    });
  }
}
