/**
 * PerfectDayReviewObserver
 *
 * Headless observer component that detects when all habits are completed
 * for the day and triggers the sentiment-gated App Store review flow after
 * the user achieves 3 perfect days.
 *
 * Renders `ReviewSentimentPrompt` and `FeedbackModal` when the review flow
 * activates. Place this once in the render tree where `completedToday` and
 * `totalHabits` are available (currently `HabitsListHeader`).
 *
 * ## Trigger logic
 * 1. `completedToday === totalHabits && totalHabits > 0` → perfect day
 * 2. `recordPerfectDay()` deduplicates per calendar date
 * 3. On the 3rd unique perfect day → `useReviewPrompt.requestReview()` fires
 * 4. All existing guards apply: platform, cooldown, yearly cap, min completions
 */

import { useEffect } from 'react';
import { usePerfectDayReview } from '../../hooks/usePerfectDayReview';
import { ReviewSentimentPrompt } from '../ReviewSentimentPrompt';
import { FeedbackModal } from '../FeedbackModal';

interface PerfectDayReviewObserverProps {
  completedToday: number;
  totalHabits: number;
  /** ISO date string for today, e.g. "2026-02-17" */
  todayIso: string;
}

export function PerfectDayReviewObserver({
  completedToday,
  totalHabits,
  todayIso,
}: PerfectDayReviewObserverProps) {
  const {
    checkPerfectDay,
    contextMessage,
    handleFeedbackClose,
    handleNegative,
    handlePositive,
    handleSentimentClose,
    sentimentVisible,
    showFeedback,
  } = usePerfectDayReview();

  const isPerfectDay = totalHabits > 0 && completedToday === totalHabits;

  useEffect(() => {
    if (isPerfectDay) {
      void checkPerfectDay(todayIso);
    }
  }, [isPerfectDay, todayIso, checkPerfectDay]);

  return (
    <>
      <ReviewSentimentPrompt
        contextMessage={contextMessage}
        visible={sentimentVisible}
        onDismiss={handleSentimentClose}
        onNegative={handleNegative}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onPositive={handlePositive}
      />

      {showFeedback && (
        <FeedbackModal
          visible={showFeedback}
          onClose={handleFeedbackClose}
        />
      )}
    </>
  );
}
