/**
 * useReduceMotion Hook
 * Checks for system reduce motion preference
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReduceMotion(respectReduceMotion: boolean) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (respectReduceMotion) {
      void AccessibilityInfo.isReduceMotionEnabled()
        .then(setReduceMotion)
        .catch((error) => {
          if (__DEV__) console.warn('Error checking reduce motion setting:', error);
          setReduceMotion(false);
        });
      const subscription = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        setReduceMotion
      );
      return () => subscription?.remove();
    }
  }, [respectReduceMotion]);

  return reduceMotion;
}
