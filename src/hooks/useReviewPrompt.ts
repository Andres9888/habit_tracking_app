/**
 * useReviewPrompt Hook
 *
 * Manages the sentiment-gated App Store review flow.
 * Components call `requestReview()` — if all guards pass (cooldown,
 * min completions, platform), the sentiment prompt appears.
 * Positive → native review. Negative → feedback form.
 *
 * Usage:
 *   const { sentimentVisible, showFeedback, ...handlers } = useReviewPrompt();
 *   // Render <ReviewSentimentPrompt> and <FeedbackModal> with these props
 */

import { useState, useCallback } from 'react';
import * as StoreReview from 'expo-store-review';
import { Platform } from 'react-native';
import {
  canRequestReview,
  recordPromptShown,
} from '../utils/storeReview';

export function useReviewPrompt() {
  const [sentimentVisible, setSentimentVisible] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  /**
   * Call this when the app reaches a review-eligible moment.
   * Checks all guards, then shows sentiment prompt if eligible.
   */
  const requestReview = useCallback(async () => {
    const eligible = await canRequestReview();
    if (!eligible) return;

    setSentimentVisible(true);
  }, []);

  /** User tapped "Yes, I love it!" */
  const handlePositive = useCallback(async () => {
    setSentimentVisible(false);
    await recordPromptShown();
    try {
      await StoreReview.requestReview();
    } catch {
      // Silent fail
    }
  }, []);

  /** User tapped "Not really" */
  const handleNegative = useCallback(() => {
    setSentimentVisible(false);
    // Record as prompted so we respect the 90-day cooldown
    void recordPromptShown();
    setShowFeedback(true);
  }, []);

  /** Dismiss sentiment prompt without action */
  const handleSentimentClose = useCallback(() => {
    setSentimentVisible(false);
  }, []);

  /** Close the feedback form */
  const handleFeedbackClose = useCallback(() => {
    setShowFeedback(false);
  }, []);

  return {
    sentimentVisible,
    showFeedback,
    requestReview,
    handlePositive,
    handleNegative,
    handleSentimentClose,
    handleFeedbackClose,
  };
}
