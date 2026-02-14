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
      await safeRun(
        days >= 30
          ? HapticPatterns.celebrationMajor
          : HapticPatterns.celebration
      );
    },
    [active]
  );

  const triggerUndo = useCallback(async () => {
    if (active) await safeRun(HapticPatterns.warning);
  }, [active]);

  return useMemo(
    () => ({
      triggerAllComplete,
      triggerCompletion,
      triggerFirstCompletion,
      triggerStreakMilestone,
      triggerUndo,
    }),
    [
      triggerCompletion,
      triggerFirstCompletion,
      triggerAllComplete,
      triggerStreakMilestone,
      triggerUndo,
    ]
  );
}

export default useCelebrationHaptics;
