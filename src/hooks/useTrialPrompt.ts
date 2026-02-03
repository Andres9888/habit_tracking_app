/**
 * useTrialPrompt Hook
 *
 * Manages the trial prompt modal state and tracking.
 * Shows the trial prompt after user creates their first habit,
 * but only once per user.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  getHasShownTrialPrompt,
  setHasShownTrialPrompt,
} from '../lib/settingsStorage';

interface UseTrialPromptOptions {
  /** Current number of habits */
  habitCount: number;
  /** Whether user is already premium */
  isPremiumUser: boolean;
}

interface UseTrialPromptResult {
  /** Whether the trial prompt modal is visible */
  visible: boolean;
  /** Handler for starting the trial */
  onStartTrial: () => void;
  /** Handler for skipping the trial */
  onSkip: () => void;
}

export function useTrialPrompt({
  habitCount,
  isPremiumUser,
}: UseTrialPromptOptions): UseTrialPromptResult {
  const [visible, setVisible] = useState(false);
  const [hasShownPrompt, setHasShownPrompt] = useState<boolean | null>(null);
  const [previousHabitCount, setPreviousHabitCount] = useState(0);

  // Load the persisted state on mount
  useEffect(() => {
    let isMounted = true;
    void getHasShownTrialPrompt().then((shown) => {
      if (isMounted) setHasShownPrompt(shown);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Show prompt after first habit is created
  useEffect(() => {
    // Don't show if:
    // - User is already premium
    // - We've already shown the prompt
    // - Storage state not loaded yet
    // - habitCount is 0 (no habits yet)
    if (
      isPremiumUser ||
      hasShownPrompt === null ||
      hasShownPrompt === true ||
      habitCount === 0
    ) {
      return;
    }

    // Detect transition from 0 to 1 habit (first habit created)
    if (previousHabitCount === 0 && habitCount === 1) {
      setVisible(true);
      setHasShownPrompt(true);
      void setHasShownTrialPrompt(true);
    }

    setPreviousHabitCount(habitCount);
  }, [habitCount, hasShownPrompt, isPremiumUser, previousHabitCount]);

  const onStartTrial = useCallback(() => {
    setVisible(false);
    // Navigate to subscription/paywall screen
    // This will be handled by the parent component
  }, []);

  const onSkip = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    onSkip,
    onStartTrial,
    visible,
  };
}
