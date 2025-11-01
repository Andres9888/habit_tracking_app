import { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { useReduceMotion } from './useReduceMotion';

type HapticKind = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface UseHapticFeedbackOptions {
  isEnabled?: boolean;
  preference?: boolean;
}

const noop = async () => {};

const INPUT_TO_FEEDBACK: Record<HapticKind, () => Promise<void>> = {
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
};

const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

export const useHapticFeedback = ({ isEnabled = true, preference }: UseHapticFeedbackOptions = {}) => {
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

    const safeCall = (fn: () => Promise<void>) => {
      fn().catch(() => {
        // Silently fail - haptics are non-critical UX enhancements
      });
    };

    return {
      triggerError: () => safeCall(INPUT_TO_FEEDBACK.error),
      triggerHeavyImpact: () => safeCall(INPUT_TO_FEEDBACK.heavy),
      triggerLightImpact: () => safeCall(INPUT_TO_FEEDBACK.light),
      triggerMediumImpact: () => safeCall(INPUT_TO_FEEDBACK.medium),
      triggerSelection: () => safeCall(() => Haptics.selectionAsync()),
      triggerSuccess: () => safeCall(INPUT_TO_FEEDBACK.success),
      triggerWarning: () => safeCall(INPUT_TO_FEEDBACK.warning),
    };
  }, [reduceMotion, isEnabled]);
};

export default useHapticFeedback;

