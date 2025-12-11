import { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { useReduceMotion } from './useReduceMotion';

interface UseHapticFeedbackOptions {
  isEnabled?: boolean;
  preference?: boolean;
}

const noop = async () => {};

const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

export const useHapticFeedback = ({ isEnabled = true, preference }: UseHapticFeedbackOptions = {}) => {
  const reduceMotion = useReduceMotion({ preference });

  return useMemo(() => {
    const hasHapticsApis = Boolean(
      Haptics?.impactAsync &&
        Haptics?.notificationAsync &&
        Haptics?.selectionAsync &&
        Haptics?.ImpactFeedbackStyle &&
        Haptics?.NotificationFeedbackType
    );

    if (!isEnabled || reduceMotion || !isHapticsSupported || !hasHapticsApis) {
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

    const safeCall = (fn: () => Promise<void> | void) => {
      Promise.resolve(fn()).catch(() => {
        // Silently fail - haptics are non-critical UX enhancements
      });
    };

    return {
      triggerError: () =>
        safeCall(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
      triggerHeavyImpact: () => safeCall(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
      triggerLightImpact: () => safeCall(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
      triggerMediumImpact: () => safeCall(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
      triggerSelection: () => safeCall(() => Haptics.selectionAsync()),
      triggerSuccess: () =>
        safeCall(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
      triggerWarning: () =>
        safeCall(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
    };
  }, [reduceMotion, isEnabled]);
};

export default useHapticFeedback;

