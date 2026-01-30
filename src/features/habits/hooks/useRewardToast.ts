import { useCallback, useState } from 'react';
import type { Habit, RewardToastData } from '../types';
import { logInteraction } from '../../../lib/analytics/interactions';

export interface UseRewardToastResult {
  rewardToast: RewardToastData | null;
  dismissRewardToast: () => void;
  notifyWeekCompletion: (params: {
    habit: Habit;
    completedDate: string;
  }) => void;
}

export function useRewardToast(
  celebrationsEnabled: boolean,
  getStreak: (habitId: string) => number
): UseRewardToastResult {
  const [rewardToast, setRewardToast] = useState<RewardToastData | null>(null);

  const dismissRewardToast = useCallback(() => {
    setRewardToast(null);
  }, []);

  const notifyWeekCompletion = useCallback(
    ({ habit, completedDate }: { habit: Habit; completedDate: string }) => {
      if (!celebrationsEnabled) {
        return;
      }

      const streak = getStreak(habit._id);

      setRewardToast({
        habitId: habit._id,
        habitName: habit.name,
        message:
          'Amazing consistency! Unlock a momentum booster to stack even more wins.',
        streak,
      });

      logInteraction('habit_week_complete', {
        completedDate,
        habitId: habit._id,
        habitName: habit.name,
        streak,
      });
    },
    [celebrationsEnabled, getStreak]
  );

  return {
    dismissRewardToast,
    notifyWeekCompletion,
    rewardToast,
  };
}
