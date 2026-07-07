/**
 * useStreakReminderScheduling — bridges habit list data into the
 * streak-at-risk notification scheduler.
 *
 * The scheduler (`useStreakReminders`) needs per-habit completion + streak
 * state that only the habits screen has, so this hook mounts it there.
 * Streak nudges always fire at the global settings time; a habit's own
 * daily reminder (habits.reminderTime) is a separate notification handled
 * by scheduleHabitReminder, so we don't reuse it here to avoid firing two
 * notifications at the same minute.
 */
import { useMemo } from 'react';
import {
  useStreakReminders,
  useStreakReminderSettings,
} from '../../../hooks/useStreakReminders';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import type { StreakReminderHabit } from '../../../hooks/useStreakReminders';
import type { Habit, HabitStatus } from '../types';

interface UseStreakReminderSchedulingParams {
  habits: Habit[];
  isPremium: boolean;
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
}

export function useStreakReminderScheduling({
  habits,
  isPremium,
  getHabitStatus,
  getStreak,
}: UseStreakReminderSchedulingParams) {
  const { enabled, reminderTime } = useStreakReminderSettings();
  const today = getLocalDateString();

  const reminderHabits = useMemo<StreakReminderHabit[]>(
    () =>
      habits.map((habit) => ({
        completedToday: getHabitStatus(habit._id, today) === 'done',
        currentStreak: getStreak(habit._id),
        habitEmoji: habit.icon,
        habitId: habit._id,
        habitName: habit.name ?? '',
      })),
    [habits, getHabitStatus, getStreak, today]
  );

  useStreakReminders({
    enabled,
    habits: reminderHabits,
    isPremium,
    reminderTime,
  });
}
