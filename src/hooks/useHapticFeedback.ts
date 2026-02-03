/**
 * useHapticFeedback Hook
 *
 * Provides haptic feedback triggers for iOS and Android devices.
 * Automatically respects accessibility settings (reduce motion) and platform capabilities.
 *
 * @example
 * ```tsx
 * const { triggerSuccess, triggerLightImpact } = useHapticFeedback();
 *
 * const handleButtonPress = () => {
 *   triggerLightImpact();
 *   // ... perform action
 * };
 *
 * const handleCompletion = () => {
 *   triggerSuccess();
 *   // ... show completion UI
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Disable haptics for a specific component
 * const haptics = useHapticFeedback({ isEnabled: false });
 * ```
 */

import { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { useReduceMotion } from './useReduceMotion';

type HapticKind =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error';

/**
 * Options for configuring haptic feedback behavior
 */
interface UseHapticFeedbackOptions {
  /** Whether haptics are enabled (default: true) */
  isEnabled?: boolean;
  /** Override for reduce motion preference (passed to useReduceMotion) */
  preference?: boolean;
}

const noop = (): void => {
  // No-op function for when haptics are disabled
};

const INPUT_TO_FEEDBACK: Record<HapticKind, () => Promise<void>> = {
  error: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
};

const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Hook that provides haptic feedback functions with automatic platform detection
 * and accessibility support.
 *
 * Returns no-op functions when:
 * - Platform doesn't support haptics (web)
 * - User has reduce motion enabled
 * - isEnabled is set to false
 *
 * All haptic functions fail silently - they're non-critical UX enhancements.
 *
 * @param options - Configuration options
 * @returns Object with haptic trigger functions
 */
export const useHapticFeedback = ({
  isEnabled = true,
  preference,
}: UseHapticFeedbackOptions = {}) => {
  const reduceMotion = useReduceMotion({ preference });

  return useMemo(() => {
    if (!isEnabled || reduceMotion || !isHapticsSupported) {
      return {
        /** No-op when haptics disabled */
        triggerError: noop,
        /** No-op when haptics disabled */
        triggerHeavyImpact: noop,
        /** No-op when haptics disabled */
        triggerLightImpact: noop,
        /** No-op when haptics disabled */
        triggerMediumImpact: noop,
        /** No-op when haptics disabled */
        triggerSelection: noop,
        /** No-op when haptics disabled */
        triggerSuccess: noop,
        /** No-op when haptics disabled */
        triggerWarning: noop,
      };
    }

    const safeCall = (fn: () => Promise<void>): void => {
      fn().catch(() => {
        // Silently fail - haptics are non-critical UX enhancements
      });
    };

    return {
      /** Trigger error notification haptic (3 taps) */
      triggerError: (): void => safeCall(INPUT_TO_FEEDBACK.error),
      /** Trigger heavy impact haptic (strong single tap) */
      triggerHeavyImpact: (): void => safeCall(INPUT_TO_FEEDBACK.heavy),
      /** Trigger light impact haptic (subtle single tap) */
      triggerLightImpact: (): void => safeCall(INPUT_TO_FEEDBACK.light),
      /** Trigger medium impact haptic (moderate single tap) */
      triggerMediumImpact: (): void => safeCall(INPUT_TO_FEEDBACK.medium),
      /** Trigger selection haptic (lightweight tap for UI element selection) */
      triggerSelection: (): void => safeCall(() => Haptics.selectionAsync()),
      /** Trigger success notification haptic (2 taps) */
      triggerSuccess: (): void => safeCall(INPUT_TO_FEEDBACK.success),
      /** Trigger warning notification haptic (2 taps) */
      triggerWarning: (): void => safeCall(INPUT_TO_FEEDBACK.warning),
    };
  }, [reduceMotion, isEnabled]);
};

export default useHapticFeedback;
