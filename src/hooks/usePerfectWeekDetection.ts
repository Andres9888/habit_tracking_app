/**
 * usePerfectWeekDetection - Detects when user completes ALL habits every day for 7 consecutive days
 *
 * A "perfect week" is a powerful milestone that deserves special celebration.
 * This hook monitors completion data and fires when the threshold is crossed.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface PerfectWeekAchievement {
  /** Number of consecutive perfect days */
  perfectDays: number;
  /** Total habits tracked */
  totalHabits: number;
  /** When the achievement was detected */
  achievedAt: Date;
}

interface UsePerfectWeekDetectionProps {
  /** Array of daily completion rates for the last 7 days (0-1 each, 1 = all complete) */
  last7DaysCompletionRates: number[];
  /** Whether detection is enabled */
  enabled?: boolean;
}

/**
 * Detects when a user achieves a "perfect week" — completing all habits every day for 7 days.
 *
 * @param props.last7DaysCompletionRates - Array of 7 completion rates (0-1), most recent last
 * @param props.enabled - Whether to run detection (default: true)
 * @returns achievement data and clear function
 *
 * @example
 * ```ts
 * const { perfectWeek, clearPerfectWeek } = usePerfectWeekDetection({
 *   last7DaysCompletionRates: [1, 1, 1, 1, 1, 1, 1], // all 100%
 * });
 *
 * if (perfectWeek) {
 *   // Show celebration!
 * }
 * ```
 */
export function usePerfectWeekDetection({
  last7DaysCompletionRates,
  enabled = true,
}: UsePerfectWeekDetectionProps) {
  const [perfectWeek, setPerfectWeek] =
    useState<PerfectWeekAchievement | null>(null);
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (!enabled || hasShownRef.current) return;
    if (last7DaysCompletionRates.length < 7) return;

    // Check if all 7 days have 100% completion
    const isPerfect = last7DaysCompletionRates
      .slice(-7)
      .every((rate) => rate >= 1);

    if (isPerfect) {
      hasShownRef.current = true;
      setPerfectWeek({
        perfectDays: 7,
        totalHabits: 0, // Caller can enrich this
        achievedAt: new Date(),
      });
    }
  }, [last7DaysCompletionRates, enabled]);

  const clearPerfectWeek = useCallback(() => {
    setPerfectWeek(null);
  }, []);

  return { perfectWeek, clearPerfectWeek };
}

export default usePerfectWeekDetection;
