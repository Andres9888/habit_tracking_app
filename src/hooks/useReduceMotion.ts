/**
 * useReduceMotion Hook
 *
 * Detects whether the user has enabled "Reduce Motion" in their device's
 * accessibility settings. This preference indicates the user wants minimal
 * or no animations.
 *
 * Respects platform accessibility:
 * - iOS: Settings → Accessibility → Motion → Reduce Motion
 * - Android: Settings → Accessibility → Remove animations
 * - Web: Always returns false (no native support)
 *
 * @example
 * ```tsx
 * const reduceMotion = useReduceMotion();
 *
 * const animationConfig = {
 *   duration: reduceMotion ? 0 : 300,
 *   useNativeDriver: true,
 * };
 *
 * Animated.timing(opacity, animationConfig).start();
 * ```
 *
 * @example
 * ```tsx
 * // Override with explicit preference
 * const reduceMotion = useReduceMotion({ preference: true });
 * ```
 */

import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Options for useReduceMotion hook
 */
interface UseReduceMotionOptions {
  /**
   * Explicit preference override. If provided, system setting is ignored.
   * Useful for testing or per-component overrides.
   */
  preference?: boolean;
}

const isNativePlatform = Platform.OS === 'ios' || Platform.OS === 'android';

// Conditionally import AccessibilityInfo only when available
// This allows the hook to work across web and native platforms
let AccessibilityInfo: any = null;
if (isNativePlatform) {
  try {
    // Dynamic require needed for cross-platform compatibility
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    AccessibilityInfo = require('react-native').AccessibilityInfo;
  } catch {
    // AccessibilityInfo not available - will use default behavior
  }
}

/**
 * Hook that returns whether reduce motion is enabled.
 *
 * Listens to system accessibility setting changes and updates automatically.
 * Returns the explicit preference if provided, otherwise returns the system setting.
 *
 * On web platforms, always returns false (no AccessibilityInfo API).
 * Fails silently if unable to read system preferences.
 *
 * @param options - Configuration options
 * @returns Boolean indicating if reduce motion is enabled
 */
export const useReduceMotion = ({
  preference,
}: UseReduceMotionOptions = {}) => {
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);

  useEffect(() => {
    // Only run on native platforms and if AccessibilityInfo is available
    if (!isNativePlatform || !AccessibilityInfo) {
      return;
    }

    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((value: boolean | null | undefined) => {
        if (isMounted) {
          setSystemReduceMotion(value ?? false);
        }
      })
      .catch(() => {
        // Silently fail - default to false if unable to read preference
        if (isMounted) {
          setSystemReduceMotion(false);
        }
      });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled: boolean | null | undefined) => {
        if (isMounted) {
          setSystemReduceMotion(enabled ?? false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  return useMemo(
    () => Boolean(preference ?? systemReduceMotion),
    [preference, systemReduceMotion]
  );
};

export default useReduceMotion;
