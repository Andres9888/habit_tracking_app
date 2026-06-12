import { useCallback, useRef, useState } from 'react';
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

  // Latest-ref: getStreak is recreated on every toggle; reading it through a
  // ref keeps notifyWeekCompletion stable so memo'd habit cards don't re-render.
  const getStreakRef = useRef(getStreak);
  getStreakRef.current = getStreak;

  const dismissRewardToast = useCallback(() => {
    setRewardToast(null);
  }, []);

  const notifyWeekCompletion = useCallback(
    ({ habit, completedDate }: { habit: Habit; completedDate: string }) => {
      if (!celebrationsEnabled) {
        return;
      }

      const streak = getStreakRef.current(habit._id);

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
    [celebrationsEnabled]
  );

  return {
    dismissRewardToast,
    notifyWeekCompletion,
    rewardToast,
  };
}
