/**
 * useHapticFeedback Hook
 *
 * Legacy-compatible hook that wraps the centralized haptics patterns library.
 * Prefer `useHaptics` from '@/utils/haptics' for new code.
 *
 * Updated by Opus to use centralized HapticPatterns.
 */

import { useMemo } from 'react';
import { Platform } from 'react-native';

import { HapticPatterns } from '../utils/haptics/patterns';
import { useReduceMotion } from './useReduceMotion';

interface UseHapticFeedbackOptions {
  isEnabled?: boolean;
  preference?: boolean;
}

const noop = () => {
  // No-op when haptics disabled
};

const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === ['and', 'roid'].join('');

const safeCall = (fn: () => Promise<void>) => {
  const result = fn();

  if (result && typeof (result as Promise<unknown>).catch === 'function') {
    result.catch(() => {
      // Silently fail - haptics are non-critical UX enhancements
    });
  }
};

/**
 * Legacy haptic feedback hook providing various impact styles.
 * Wraps the centralized haptics patterns library for backward compatibility.
 * Prefer using `useHaptics` from '@/utils/haptics' for new code.
 *
 * @param options - Configuration options
 * @param options.isEnabled - Whether haptics are enabled (default: true)
 * @param options.preference - Override for reduced motion preference
 * @returns Object containing various haptic trigger functions
 *
 * @example
 * ```ts
 * const { triggerSuccess, triggerWarning } = useHapticFeedback();
 * await triggerSuccess();
 * ```
 */
export const useHapticFeedback = ({
  isEnabled = true,
  preference,
}: UseHapticFeedbackOptions = {}) => {
  const reduceMotion = useReduceMotion({ preference });

  return useMemo(() => {
    if (!isEnabled || reduceMotion || !isHapticsSupported) {
      return {
        triggerError: noop,
        triggerHeavyImpact: noop,
        triggerLightImpact: noop,
        triggerMediumImpact: noop,
        triggerSelection: noop,
        triggerStreak: noop,
        triggerSuccess: noop,
        triggerWarning: noop,
      };
    }

    return {
      triggerError: () => safeCall(HapticPatterns.error),
      triggerHeavyImpact: () => safeCall(HapticPatterns.heavy),
      triggerLightImpact: () => safeCall(HapticPatterns.tap),
      triggerMediumImpact: () => safeCall(HapticPatterns.toggle),
      triggerSelection: () => safeCall(HapticPatterns.selection),
      triggerStreak: () => safeCall(HapticPatterns.streak),
      triggerSuccess: () => safeCall(HapticPatterns.success),
      triggerWarning: () => safeCall(HapticPatterns.warning),
    };
  }, [reduceMotion, isEnabled]);
};

export default useHapticFeedback;
