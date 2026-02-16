/**
 * useCelebrationHaptics Hook
 *
 * Enhanced haptic feedback for celebrations and milestones.
 * Now powered by the centralized HapticPatterns library.
 *
 * Updated by Opus to use centralized patterns.
 */

import { useCallback, useMemo } from 'react';
import { Platform } from 'react-native';

import { HapticPatterns } from '../utils/haptics/patterns';
import { useReduceMotion } from './useReduceMotion';

interface UseCelebrationHapticsOptions {
  isEnabled?: boolean;
  preference?: boolean;
}

const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

/** Safely run a haptic pattern, swallowing errors. */
const safeRun = async (fn: () => Promise<void>) => {
  try {
    await fn();
  } catch {
    // Haptics are non-critical
  }
};

/**
 * Enhanced haptic feedback hook for celebrations and milestones.
 * Provides various triggers for different celebration scenarios with
 * automatic Respect for Reduced Motion accessibility settings.
 *
 * @param options - Configuration options
 * @param options.isEnabled - Whether haptics are enabled (default: true)
 * @param options.preference - Override for reduced motion preference
 * @returns Object containing various haptic trigger functions
 *
 * @example
 * ```ts
 * const { triggerCompletion, triggerStreakMilestone } = useCelebrationHaptics();
 *
 * // Trigger on habit completion
 * await triggerCompletion();
 *
 * // Trigger on milestone (e.g., 30 day streak)
 * await triggerStreakMilestone(30);
 * ```
 */
export function useCelebrationHaptics({
  isEnabled = true,
  preference,
}: UseCelebrationHapticsOptions = {}) {
  const reduceMotion = useReduceMotion({ preference });
  const active = isEnabled && !reduceMotion && isHapticsSupported;

  const triggerCompletion = useCallback(async () => {
    if (active) await safeRun(HapticPatterns.tap);
  }, [active]);

  const triggerFirstCompletion = useCallback(async () => {
    if (active) await safeRun(HapticPatterns.streak);
  }, [active]);

  const triggerAllComplete = useCallback(async () => {
    if (active) await safeRun(HapticPatterns.celebration);
  }, [active]);

  const triggerStreakMilestone = useCallback(
    async (days: number) => {
      if (!active) return;
      if (days >= 100) {
        await safeRun(HapticPatterns.celebrationLegendary);
      } else if (days >= 30) {
        await safeRun(HapticPatterns.celebrationMajor);
      } else {
        await safeRun(HapticPatterns.celebration);
      }
    },
    [active]
  );

  const triggerPerfectWeek = useCallback(async () => {
    if (active) await safeRun(HapticPatterns.celebrationLegendary);
  }, [active]);

  const triggerUndo = useCallback(async () => {
    if (active) await safeRun(HapticPatterns.warning);
  }, [active]);

  return useMemo(
    () => ({
      triggerAllComplete,
      triggerCompletion,
      triggerFirstCompletion,
      triggerPerfectWeek,
      triggerStreakMilestone,
      triggerUndo,
    }),
    [
      triggerCompletion,
      triggerFirstCompletion,
      triggerAllComplete,
      triggerPerfectWeek,
      triggerStreakMilestone,
      triggerUndo,
    ]
  );
}

export default useCelebrationHaptics;
