import { useCallback, useState } from 'react';
import {
  checkStreakMilestoneCrossed,
  type StreakMilestone,
} from './constants';
import { persistMilestoneShown } from './useMilestoneCheck';
import {
  maybeRequestReview,
  incrementCompletionCount,
} from '../../utils/storeReview';

interface CelebrationData {
  milestone: StreakMilestone;
  habitId: string;
  habitName: string;
  habitEmoji: string;
  streakDays: number;
}

export function useCelebrationHandlers() {
  const [celebrationData, setCelebrationData] = useState<CelebrationData | null>(null);

  const checkAndCelebrate = useCallback(
    (
      habitId: string,
      habitName: string,
      habitEmoji: string,
      previousStreak: number,
      currentStreak: number
    ) => {
      void incrementCompletionCount();
      const milestone = checkStreakMilestoneCrossed(previousStreak, currentStreak);

      if (milestone) {
        setCelebrationData({
          habitEmoji,
          habitId,
          habitName,
          milestone,
          streakDays: currentStreak,
        });
      }
    },
    []
  );

  const handleClose = useCallback(() => {
    if (celebrationData) {
      persistMilestoneShown(
        celebrationData.habitId,
        celebrationData.milestone.days,
      );
      setTimeout(() => {
        void maybeRequestReview(celebrationData.milestone.days);
      }, 500);
    }
    setCelebrationData(null);
  }, [celebrationData]);

  return {
    celebrationData,
    checkAndCelebrate,
    handleClose,
  };
}
