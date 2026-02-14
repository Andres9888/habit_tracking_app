/**
 * usePerfectDayDetection Hook
 *
 * Detects when all habits for the day are completed and triggers celebration.
 * Uses a ref to track previous completion state to fire only on the transition
 * from "not all done" → "all done".
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { getLocalDateString } from '../utils/getLocalDateString';

interface UsePerfectDayDetectionOptions {
  completedToday: number;
  totalHabits: number;
  /** Prevent re-triggering if already celebrated today */
  enabled?: boolean;
}

export function usePerfectDayDetection({
  completedToday,
  totalHabits,
  enabled = true,
}: UsePerfectDayDetectionOptions) {
  const [showCelebration, setShowCelebration] = useState(false);
  const previousCompletedRef = useRef(completedToday);
  const celebratedDateRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || totalHabits === 0) {
      previousCompletedRef.current = completedToday;
      return;
    }

    const today = getLocalDateString();
    const wasAllComplete = previousCompletedRef.current >= totalHabits;
    const isAllComplete = completedToday >= totalHabits;

    // Trigger only on the transition to all-complete, once per day
    if (
      isAllComplete &&
      !wasAllComplete &&
      celebratedDateRef.current !== today
    ) {
      celebratedDateRef.current = today;
      setShowCelebration(true);
    }

    previousCompletedRef.current = completedToday;
  }, [completedToday, totalHabits, enabled]);

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return {
    showCelebration,
    dismissCelebration,
  };
}

export default usePerfectDayDetection;
