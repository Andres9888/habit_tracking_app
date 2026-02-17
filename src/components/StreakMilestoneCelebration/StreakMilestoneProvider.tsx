/* eslint-disable max-lines */
/**
 * StreakMilestoneProvider
 * Global provider for managing streak milestone celebrations
 *
 * Exposes a trigger function that can be called from anywhere
 * when a habit completion might cross a milestone threshold.
 *
 * Also manages the sentiment-gated App Store review flow:
 * - 7-day streak → sentiment prompt → native review (positive) or feedback (negative)
 * - 50 total completions → sentiment prompt → native review or feedback
 *
 * Builds on the sentiment gate introduced in PR #955.
 */

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { StreakMilestoneCelebration } from './StreakMilestoneCelebration';
import { ShareCardGenerator } from '../ShareCardGenerator';
import { ReviewSentimentPrompt } from '../ReviewSentimentPrompt';
import { FeedbackModal } from '../FeedbackModal';
import { useCelebrationHandlers } from './useCelebrationHandlers';

interface StreakMilestoneContextValue {
  checkAndCelebrate: (
    habitId: string,
    habitName: string,
    habitEmoji: string,
    previousStreak: number,
    currentStreak: number
  ) => void;
}

const StreakMilestoneContext =
  createContext<StreakMilestoneContextValue | null>(null);

interface StreakMilestoneProviderProps {
  children: ReactNode;
  /** User name for share cards */
  userName?: string;
}

export function StreakMilestoneProvider({
  children,
  userName = '',
}: StreakMilestoneProviderProps) {
  const {
    celebrationData,
    reviewPrompt,
    shareData,
    showShareCard,
    checkAndCelebrate,
    handleClose,
    handleShare,
    handleShareClose,
  } = useCelebrationHandlers(userName);

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

      {/* Sentiment-gated review prompt (PR #955 + review-optimization) */}
      <ReviewSentimentPrompt
        contextMessage={reviewPrompt.contextMessage}
        visible={reviewPrompt.sentimentVisible}
        onDismiss={reviewPrompt.handleSentimentClose}
        onNegative={reviewPrompt.handleNegative}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onPositive={reviewPrompt.handlePositive}
      />

      {/* Private feedback form — shown when user selects "Not really" */}
      {reviewPrompt.showFeedback && (
        <FeedbackModal
          visible={reviewPrompt.showFeedback}
          onClose={reviewPrompt.handleFeedbackClose}
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
