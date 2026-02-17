import { useCallback, useState } from 'react';
import {
  checkStreakMilestoneCrossed,
  type StreakMilestone,
} from './constants';
import { persistMilestoneShown } from './useMilestoneCheck';
import {
  incrementCompletionCount,
  MILESTONE_50_SENTINEL,
} from '../../utils/storeReview';
import { useReviewPrompt } from '../../hooks/useReviewPrompt';
import {
  REVIEW_STREAK_DAYS,
  buildStreakReviewMessage,
  streakToMilestoneLevel,
} from './celebrationUtils';
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

  const reviewPrompt = useReviewPrompt();

  const checkAndCelebrate = useCallback(
    (
      habitId: string,
      habitName: string,
      habitEmoji: string,
      previousStreak: number,
      currentStreak: number
    ) => {
      void incrementCompletionCount().then((count) => {
        if (count === MILESTONE_50_SENTINEL) {
          void reviewPrompt.requestReview(
            "You've completed 50 habits — incredible dedication! 🏆",
          );
        }
      });

      const milestone = checkStreakMilestoneCrossed(previousStreak, currentStreak);
      if (milestone) {
        setCelebrationData({ habitEmoji, habitId, habitName, milestone, streakDays: currentStreak });
      }
    },
    [reviewPrompt.requestReview],
  );

  const handleClose = useCallback(() => {
    if (celebrationData) {
      void persistMilestoneShown(celebrationData.habitId, celebrationData.milestone.days);
      if (REVIEW_STREAK_DAYS.has(celebrationData.milestone.days)) {
        const message = buildStreakReviewMessage(celebrationData.milestone.days);
        // Delay to let the celebration modal finish closing before the sentiment prompt appears
        void setTimeout(() => {
          void reviewPrompt.requestReview(message);
        }, 500);
      }
    }
    setCelebrationData(null);
  }, [celebrationData, reviewPrompt.requestReview]);

  const handleShare = useCallback(() => {
    if (!celebrationData) return;
    setShareData({
      habitName: celebrationData.habitName,
      milestoneLevel: streakToMilestoneLevel(celebrationData.milestone.days),
      strengthPercentage: Math.round(
        (celebrationData.streakDays / celebrationData.milestone.days) * 100
      ),
      userName,
    });
    setShowShareCard(true);
  }, [celebrationData, userName]);

  const handleShareClose = useCallback(() => {
    setShowShareCard(false);
    setShareData(null);
    handleClose();
  }, [handleClose]);

  return {
    celebrationData,
    reviewPrompt,
    shareData,
    showShareCard,
    checkAndCelebrate,
    handleClose,
    handleShare,
    handleShareClose,
  };
}
