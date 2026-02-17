/**
 * useReviewPrompt Hook
 *
 * Manages the sentiment-gated App Store review flow (PR #955 pattern).
 *
 * Components call `requestReview(contextMessage?)` at a review-eligible
 * moment. If all guards pass (cooldown, min completions, yearly cap,
 * platform support), the sentiment prompt appears.
 *
 * Flow:
 *   Positive ("Yes, I love it!") → records prompt, triggers native review
 *   Negative ("Not really")      → records prompt, opens private feedback form
 *
 * ## Supported trigger moments
 * - 7-day streak milestone (via `StreakMilestoneProvider`)
 * - 3× perfect day (via `usePerfectDayReview`)
 * - 50 total completions milestone (via `incrementCompletionCount` sentinel)
 *
 * @example
 * ```tsx
 * const { sentimentVisible, contextMessage, showFeedback, ...handlers } =
 *   useReviewPrompt();
 *
 * return (
 *   <>
 *     <ReviewSentimentPrompt
 *       visible={sentimentVisible}
 *       contextMessage={contextMessage}
 *       onPositive={handlers.handlePositive}
 *       onNegative={handlers.handleNegative}
 *       onDismiss={handlers.handleSentimentClose}
 *     />
 *     {showFeedback && (
 *       <FeedbackModal visible onClose={handlers.handleFeedbackClose} />
 *     )}
 *   </>
 * );
 * ```
 */

import { useState, useCallback } from 'react';
import * as StoreReview from 'expo-store-review';
import { canRequestReview, recordPromptShown } from '../utils/storeReview';

export interface UseReviewPromptReturn {
  /** Whether the sentiment pre-prompt modal should be visible */
  sentimentVisible: boolean;
  /** Optional context string passed to the prompt subtitle */
  contextMessage: string | undefined;
  /** Whether to show the private feedback form */
  showFeedback: boolean;
  /**
   * Call at a review-eligible moment. Checks all guards; if eligible,
   * shows the sentiment prompt.
   *
   * @param message - Optional context shown in the sentiment modal,
   *                  e.g. "You just hit a 7-day streak! 🎉"
   */
  requestReview: (message?: string) => Promise<void>;
  /** Handler for the "Yes, I love it!" button */
  handlePositive: () => Promise<void>;
  /** Handler for the "Not really" button */
  handleNegative: () => void;
  /** Handler for backdrop dismiss */
  handleSentimentClose: () => void;
  /** Handler to close the feedback form */
  handleFeedbackClose: () => void;
}

export function useReviewPrompt(): UseReviewPromptReturn {
  const [sentimentVisible, setSentimentVisible] = useState(false);
  const [contextMessage, setContextMessage] = useState<string | undefined>();
  const [showFeedback, setShowFeedback] = useState(false);

  const requestReview = useCallback(async (message?: string) => {
    const eligible = await canRequestReview();
    if (!eligible) return;

    setContextMessage(message);
    setSentimentVisible(true);
  }, []);

  /** User confirmed positive sentiment — show native review dialog */
  const handlePositive = useCallback(async () => {
    setSentimentVisible(false);
    await recordPromptShown();
    try {
      await StoreReview.requestReview();
    } catch {
      // Silent fail — never break the app for a rating prompt
    }
  }, []);

  /** User indicated negative sentiment — route to private feedback */
  const handleNegative = useCallback(() => {
    setSentimentVisible(false);
    // Count as prompted so the cooldown and yearly cap are respected
    void recordPromptShown();
    setShowFeedback(true);
  }, []);

  /** Dismiss the sentiment modal without action (e.g. backdrop tap) */
  const handleSentimentClose = useCallback(() => {
    setSentimentVisible(false);
    setContextMessage(undefined);
  }, []);

  /** Close the private feedback form */
  const handleFeedbackClose = useCallback(() => {
    setShowFeedback(false);
  }, []);

  return {
    contextMessage,
    handleFeedbackClose,
    handleNegative,
    handlePositive,
    handleSentimentClose,
    requestReview,
    sentimentVisible,
    showFeedback,
  };
}
