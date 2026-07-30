import { useMemo } from 'react';
import { getLocalDateString } from '@/utils/getLocalDateString';
import type { DayCompletionStatus } from '../../../components/CalendarTimeline';
import type { Habit, HabitStatus } from '../types';
import { buildHabitEffortForecast } from './habitEffortForecast';

interface UseHabitsListHeaderStatsParams {
  habits: Habit[];
  weekDateStrings: string[];
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
}

export function useHabitsListHeaderStats({
  habits,
  weekDateStrings,
  getHabitStatus,
  getStreak,
}: UseHabitsListHeaderStatsParams) {
  const todayString = getLocalDateString();
  const totalHabits = habits.length;

  const { completedToday, completionByDay } = useMemo(() => {
    const effortForecast = buildHabitEffortForecast({
      dateStrings: weekDateStrings,
      getHabitStatus,
      habits,
      todayString,
    });
    const result: Record<string, DayCompletionStatus> = {};
    for (const dateString of weekDateStrings) {
      result[dateString] = {
        completed: 0,
        total: totalHabits,
        ...effortForecast[dateString],
      };
    }

    let todayCompleted = 0;
    for (const habit of habits) {
      if (getHabitStatus(habit._id, todayString) === 'done') {
        todayCompleted += 1;
      }
      for (const dateString of weekDateStrings) {
        if (getHabitStatus(habit._id, dateString) === 'done') {
          result[dateString].completed += 1;
        }
      }
    }

    return { completedToday: todayCompleted, completionByDay: result };
  }, [habits, weekDateStrings, getHabitStatus, todayString, totalHabits]);

  const currentStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map((habit) => getStreak(habit._id)));
  }, [habits, getStreak]);

  const averageStrengthPercent = useMemo(() => {
    if (habits.length === 0) return 0;
    let sum = 0;
    for (const habit of habits) {
      sum += habit.strength ?? 0;
    }
    return Math.round((sum / habits.length) * 100);
  }, [habits]);

  return {
    averageStrengthPercent,
    completedToday,
    completionByDay,
    currentStreak,
    totalHabits,
  };
}
