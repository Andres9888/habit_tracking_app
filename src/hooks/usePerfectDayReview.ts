/**
 * usePerfectDayReview Hook
 *
 * Tracks "perfect days" (all habits completed) and triggers the sentiment-
 * gated App Store review prompt when the threshold is reached (3 perfect days).
 *
 * Intended to be called from whatever component detects that all habits for
 * today are done (e.g. after a toggle that makes completedToday === totalHabits).
 *
 * @example
 * ```tsx
 * const { checkPerfectDay, ...reviewProps } = usePerfectDayReview();
 *
 * // After a habit toggle:
 * useEffect(() => {
 *   if (totalHabits > 0 && completedToday === totalHabits) {
 *     void checkPerfectDay(todayString);
 *   }
 * }, [completedToday, totalHabits, todayString]);
 *
 * return (
 *   <>
 *     <ReviewSentimentPrompt
 *       visible={reviewProps.sentimentVisible}
 *       contextMessage={reviewProps.contextMessage}
 *       onPositive={reviewProps.handlePositive}
 *       onNegative={reviewProps.handleNegative}
 *       onDismiss={reviewProps.handleSentimentClose}
 *     />
 *     {reviewProps.showFeedback && (
 *       <FeedbackModal visible onClose={reviewProps.handleFeedbackClose} />
 *     )}
 *   </>
 * );
 * ```
 */

import { useCallback } from 'react';
import { recordPerfectDay } from '../utils/storeReview';
import { useReviewPrompt } from './useReviewPrompt';
import type { UseReviewPromptReturn } from './useReviewPrompt';

export interface UsePerfectDayReviewReturn extends UseReviewPromptReturn {
  /**
   * Call when all habits are completed for a given day.
   * Increments the counter; triggers the review prompt on the 3rd perfect day.
   *
   * @param todayIso - ISO date string, e.g. "2026-02-17"
   */
  checkPerfectDay: (todayIso: string) => Promise<void>;
}

export function usePerfectDayReview(): UsePerfectDayReviewReturn {
  const reviewPrompt = useReviewPrompt();

  const checkPerfectDay = useCallback(
    async (todayIso: string) => {
      const thresholdReached = await recordPerfectDay(todayIso);
      if (thresholdReached) {
        await reviewPrompt.requestReview(
          "You've completed all your habits 3 days in a row — you're on fire! 🔥",
        );
      }
    },
    [reviewPrompt.requestReview],
  );

  return {
    ...reviewPrompt,
    checkPerfectDay,
  };
}
