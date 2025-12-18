import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

interface UseReduceMotionOptions {
  preference?: boolean;
}

const isNativePlatform = Platform.OS === 'ios' || Platform.OS === 'android';

// Lazy import AccessibilityInfo only when available
let AccessibilityInfo: any;
try {
  AccessibilityInfo = require('react-native').AccessibilityInfo;
} catch (e) {
  // AccessibilityInfo not available in this environment
  AccessibilityInfo = null;
}

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

