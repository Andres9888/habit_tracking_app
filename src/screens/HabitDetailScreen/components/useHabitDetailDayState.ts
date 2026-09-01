import { useMemo } from 'react';
import {
  getHabitDayState,
  type HabitDayContext,
} from '../../../features/habits/habitDayState';
import type { Habit } from '../../../features/habits/types';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import {
  brokenRunLength,
  missedLastScheduledDate,
  recoveryMissedDayLabel,
  streakStats,
  useStreakRuns,
} from '../insights';

interface HabitDetailDayStateArgs {
  completedDates: Set<string>;
  habit: Habit;
  insightDoneDates: Set<string>;
  isCompletedToday: boolean;
}

export function useHabitDetailDayState({
  completedDates,
  habit,
  insightDoneDates,
  isCompletedToday,
}: HabitDetailDayStateArgs) {
  const today = getLocalDateString();
  const effectiveCompletedDates = useMemo(() => {
    const merged = new Set([...completedDates, ...insightDoneDates]);
    if (isCompletedToday) merged.add(today);
    else merged.delete(today);
    return merged;
  }, [completedDates, insightDoneDates, isCompletedToday, today]);
  const dayContext: HabitDayContext = {
    createdAt: habit.createdAt,
    daysOfWeek: habit.daysOfWeek,
    pausedAt: habit.pausedAt,
    resumedAt: habit.resumedAt,
  };
  const todayState = getHabitDayState({
    ...dayContext,
    completed: isCompletedToday,
    date: today,
    today,
  });
  const candidate =
    todayState === 'open-today'
      ? missedLastScheduledDate({
          completedDates: effectiveCompletedDates,
          daysOfWeek: habit.daysOfWeek,
          isCompletedToday,
          today,
        })
      : null;
  const missedDate =
    candidate &&
    getHabitDayState({
      ...dayContext,
      completed: effectiveCompletedDates.has(candidate),
      date: candidate,
      today,
    }) === 'missed'
      ? candidate
      : null;

  const runs = useStreakRuns(effectiveCompletedDates, {
    pausedAt: habit.pausedAt,
    resumedAt: habit.resumedAt,
  });

  return {
    /** Length of the run the miss ended; 0 outside recovery. */
    brokenRun: missedDate
      ? brokenRunLength(runs, missedDate, {
          daysOfWeek: habit.daysOfWeek,
          pausedAt: habit.pausedAt,
          resumedAt: habit.resumedAt,
        })
      : 0,
    effectiveCompletedDates,
    isRecovery: todayState === 'open-today' && missedDate !== null,
    /** Current streak as the log reports it — never `habit.currentStreak`. */
    loggedStreak: streakStats(runs).current,
    recoveryDayLabel: missedDate
      ? recoveryMissedDayLabel(missedDate, today)
      : undefined,
    /** The missed scheduled date itself — the recovery copy derives from it. */
    recoveryMissedDate: missedDate,
    today,
    todayState,
  };
}
