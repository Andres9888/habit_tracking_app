/**
 * StreakMilestoneProvider
 * Global provider for managing streak milestone celebrations
 *
 * Exposes a trigger function that can be called from anywhere
 * when a habit completion might cross a milestone threshold
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

interface StreakMilestoneContextValue {
  /**
   * Check if a streak crosses a milestone and trigger celebration if so
   * @param habitId - Unique habit identifier
   * @param habitName - Display name of the habit
   * @param habitEmoji - Emoji icon for the habit
   * @param previousStreak - Streak before completion
   * @param currentStreak - Streak after completion
   */
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
  /** User name for share cards */
  userName?: string;
}

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
      // Track completion for store review eligibility
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
      // Persist that this milestone was shown
      persistMilestoneShown(
        celebrationData.habitId,
        celebrationData.milestone.days,
      );
      // After celebration dismissal, maybe prompt for App Store review
      // Small delay so the modal finishes closing before the system dialog appears
      setTimeout(() => {
        void maybeRequestReview({
          milestoneDays: celebrationData.milestone.days,
          currentStreak: celebrationData.streakDays,
        });
      }, 500);
    }
    setCelebrationData(null);
  }, [celebrationData]);

  const handleShare = useCallback(() => {
    if (celebrationData) {
      // Map streak milestone to strength level for share card
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
    // Also close the celebration modal
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

      {/* Celebration Modal */}
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

      {/* Share Card Generator */}
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

/**
 * Hook to access streak milestone celebration trigger
 */
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
