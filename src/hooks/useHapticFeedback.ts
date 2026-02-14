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

const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

const safeCall = (fn: () => Promise<void>) => {
  fn().catch(() => {
    // Silently fail - haptics are non-critical UX enhancements
  });
};

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
      triggerSuccess: () => safeCall(HapticPatterns.success),
      triggerWarning: () => safeCall(HapticPatterns.warning),
    };
  }, [reduceMotion, isEnabled]);
};

export default useHapticFeedback;
