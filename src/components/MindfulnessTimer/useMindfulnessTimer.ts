/**
 * useMindfulnessTimer Hook
 *
 * Manages the mindfulness timer modal state for a habit card.
 * When a mindfulness habit is tapped (and not yet completed),
 * shows the timer instead of immediately completing.
 */

import { useState, useCallback } from 'react';
import { isMindfulnessHabit } from './mindfulnessUtils';

interface UseMindfulnessTimerOptions {
  habitName: string;
  habitIcon?: string;
  completed: boolean;
}

export function useMindfulnessTimer({
  habitName,
  habitIcon,
  completed,
}: UseMindfulnessTimerOptions) {
  const [showTimer, setShowTimer] = useState(false);

  const isMindful = isMindfulnessHabit(habitName, habitIcon);

  /**
   * Returns true if the tap should be intercepted (timer shown instead).
   * Returns false if normal completion should proceed.
   */
  const shouldIntercept = useCallback((): boolean => {
    if (!isMindful || completed) return false;
    setShowTimer(true);
    return true;
  }, [isMindful, completed]);

  const dismissTimer = useCallback(() => {
    setShowTimer(false);
  }, []);

  return {
    /** Whether this habit is a mindfulness habit */
    isMindfulnessHabit: isMindful,
    /** Whether the timer modal is visible */
    showTimer,
    /** Show the timer */
    setShowTimer,
    /** Check if tap should be intercepted; if so, shows timer and returns true */
    shouldIntercept,
    /** Dismiss the timer */
    dismissTimer,
  };
}
