/**
 * useFirstCompletionDetection - Detects user's very first habit completion ever
 *
 * The first completion is a critical retention moment. Users who celebrate
 * their first action are significantly more likely to return (BJ Fogg research).
 *
 * Uses AsyncStorage to persist the "has completed before" flag.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@chain_day/has_completed_first_habit';

export interface FirstCompletionAchievement {
  /** The habit name that was first completed */
  habitName: string;
  /** When it happened */
  achievedAt: Date;
}

/**
 * Detects the user's very first-ever habit completion.
 *
 * Call `checkFirstCompletion(habitName)` when a habit is completed.
 * If it's the first ever, `firstCompletion` will be set.
 *
 * @example
 * ```ts
 * const { firstCompletion, checkFirstCompletion, clearFirstCompletion } =
 *   useFirstCompletionDetection();
 *
 * // In habit completion handler:
 * await checkFirstCompletion('Morning Walk');
 *
 * if (firstCompletion) {
 *   // Show special first-ever celebration!
 * }
 * ```
 */
export function useFirstCompletionDetection() {
  const [firstCompletion, setFirstCompletion] =
    useState<FirstCompletionAchievement | null>(null);
  const hasCompletedBeforeRef = useRef<boolean | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        hasCompletedBeforeRef.current = value === 'true';
      })
      .catch(() => {
        hasCompletedBeforeRef.current = false;
      });
  }, []);

  const checkFirstCompletion = useCallback(async (habitName: string) => {
    // Still loading or already completed before
    if (hasCompletedBeforeRef.current === null) return;
    if (hasCompletedBeforeRef.current === true) return;

    // This is the first ever completion!
    hasCompletedBeforeRef.current = true;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Non-critical — worst case, we show the celebration again
    }

    setFirstCompletion({
      habitName,
      achievedAt: new Date(),
    });
  }, []);

  const clearFirstCompletion = useCallback(() => {
    setFirstCompletion(null);
  }, []);

  return { firstCompletion, checkFirstCompletion, clearFirstCompletion };
}

export default useFirstCompletionDetection;
