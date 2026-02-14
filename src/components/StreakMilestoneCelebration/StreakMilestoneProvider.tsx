/**
 * StreakMilestoneProvider
 * Global provider for managing streak milestone celebrations
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { StreakMilestoneCelebration } from './StreakMilestoneCelebration';
import { ShareCardGenerator } from '../ShareCardGenerator';
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

interface ShareCardData {
  habitName: string;
  streakCount: number;
  milestoneDays: 7 | 30 | 100;
  motivationalMessage: string;
  userName: string;
}

interface StreakMilestoneContextValue {
  checkAndCelebrate: (
    habitId: string,
    habitName: string,
    habitEmoji: string,
    previousStreak: number,
    currentStreak: number
  ) => void;
}

const StreakMilestoneContext = createContext<StreakMilestoneContextValue | null>(
  null
);

interface StreakMilestoneProviderProps {
  children: ReactNode;
  userName?: string;
}

const MILESTONE_MESSAGES: Record<7 | 30 | 100, string> = {
  7: '7 days strong. Small daily wins build unstoppable momentum.',
  30: '30-day streak unlocked. Your consistency is becoming your identity.',
  100: '100 days in a row. This is elite follow-through.',
};

export function StreakMilestoneProvider({
  children,
  userName = '',
}: StreakMilestoneProviderProps) {
  const [celebrationData, setCelebrationData] = useState<CelebrationData | null>(
    null
  );
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
      const milestoneDays = celebrationData.milestone.days as 7 | 30 | 100;

      setShareData({
        habitName: celebrationData.habitName,
        milestoneDays,
        motivationalMessage: MILESTONE_MESSAGES[milestoneDays],
        streakCount: celebrationData.streakDays,
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

  const contextValue = useMemo<StreakMilestoneContextValue>(
    () => ({
      checkAndCelebrate,
    }),
    [checkAndCelebrate]
  );

  return (
    <StreakMilestoneContext.Provider value={contextValue}>
      {children}

      {celebrationData && (
        <StreakMilestoneCelebration
          habitEmoji={celebrationData.habitEmoji}
          habitName={celebrationData.habitName}
          milestone={celebrationData.milestone}
          streakDays={celebrationData.streakDays}
          visible={!!celebrationData}
          onClose={handleClose}
          onShare={handleShare}
        />
      )}

      {shareData && (
        <ShareCardGenerator
          data={shareData}
          visible={showShareCard}
          onClose={handleShareClose}
        />
      )}
    </StreakMilestoneContext.Provider>
  );
}

export function useStreakMilestone(): StreakMilestoneContextValue {
  const context = useContext(StreakMilestoneContext);

  if (!context) {
    throw new Error(
      'useStreakMilestone must be used within a StreakMilestoneProvider'
    );
  }

  return context;
}

export default StreakMilestoneProvider;
