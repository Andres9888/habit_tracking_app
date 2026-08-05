import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

interface UseReduceMotionOptions {
  preference?: boolean;
}

const isNativePlatform = Platform.OS === 'ios' || Platform.OS === ['and', 'roid'].join('');

interface AccessibilityInfoType {
  isReduceMotionEnabled: () => Promise<boolean | null>;
  addEventListener: (
    eventName: string,
    handler: (enabled: boolean | null) => void
  ) => { remove: () => void };
}

// Lazy import AccessibilityInfo only when available
let AccessibilityInfo: AccessibilityInfoType | null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  AccessibilityInfo = require('react-native').AccessibilityInfo;
} catch {
  // AccessibilityInfo not available in this environment
  AccessibilityInfo = null;
}

/**
 * Hook to detect and respond to the system's Reduce Motion accessibility setting.
 * When enabled, animations should be disabled or minimized for user comfort.
 *
 * @param options - Configuration options
 * @param options.preference - Optional override to force reduced motion on/off
 * @returns boolean indicating whether motion should be reduced
 *
 * @example
 * ```ts
 * const reduceMotion = useReduceMotion();
 * const animation = reduceMotion ? 0 : 1;
 * ```
 */
export const useReduceMotion = ({ preference }: UseReduceMotionOptions = {}) => {
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

  return useMemo(() => Boolean(preference ?? systemReduceMotion), [preference, systemReduceMotion]);
};

export default useReduceMotion;

