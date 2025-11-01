import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

interface UseReduceMotionOptions {
  preference?: boolean;
}

const isNativePlatform = Platform.OS === 'ios' || Platform.OS === 'android';

export const useReduceMotion = ({ preference }: UseReduceMotionOptions = {}) => {
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);

  useEffect(() => {
    if (!isNativePlatform) {
      return;
    }

    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
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
      (enabled) => {
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

