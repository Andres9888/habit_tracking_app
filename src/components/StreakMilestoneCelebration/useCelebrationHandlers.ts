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
import type { MilestoneLevel } from '../ShareCardGenerator/ShareCardGenerator.types';

interface CelebrationData {
  milestone: StreakMilestone;
  habitId: string;
  habitName: string;
  habitEmoji: string;
  streakDays: number;
}

interface ShareCardData {
  habitName: string;
  milestoneLevel: MilestoneLevel;
  strengthPercentage: number;
  userName: string;
}

export function useCelebrationHandlers(userName: string) {
  const [celebrationData, setCelebrationData] = useState<CelebrationData | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareData, setShareData] = useState<ShareCardData | null>(null);

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

  const handleShare = useCallback(() => {
    if (celebrationData) {
      const milestoneLevel: MilestoneLevel =
        celebrationData.milestone.days >= 100
          ? 'automatic'
          : celebrationData.milestone.days >= 30
            ? 'strong'
            : 'developing';

      setShareData({
        habitName: celebrationData.habitName,
        milestoneLevel,
        strengthPercentage: Math.round(
          (celebrationData.streakDays / celebrationData.milestone.days) * 100
        ),
        userName,
      });
      setShowShareCard(true);
    }
  }, [celebrationData, userName]);

  const handleShareClose = useCallback(() => {
    setShowShareCard(false);
    setShareData(null);
    handleClose();
  }, [handleClose]);

  return {
    celebrationData,
    shareData,
    showShareCard,
    checkAndCelebrate,
    handleClose,
    handleShare,
    handleShareClose,
  };
}
